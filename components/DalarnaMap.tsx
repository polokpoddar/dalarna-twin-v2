"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MUNICIPALITIES, getRiskColor } from "@/lib/constants";
import { RiskLevel } from "@/lib/types";

interface DalarnaMapProps {
  municipalityRisks?: Record<string, RiskLevel>;
  onSelectMunicipality?: (code: string) => void;
}

export default function DalarnaMap({
  municipalityRisks,
  onSelectMunicipality,
}: DalarnaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  const [tileMode, setTileMode] = useState<"satellite" | "dark" | "osm">("satellite");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [hoveredMuni, setHoveredMuni] = useState<{
    name: string;
    code: string;
    population: number;
    density: number;
    risk?: RiskLevel;
  } | null>(null);

  function getTileConfig(mode: string) {
    switch (mode) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: "Esri World Imagery",
          maxZoom: 18,
        };
      case "dark":
        return {
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attribution: "© OpenStreetMap contributors, © CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        };
      case "osm":
      default:
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "© OpenStreetMap contributors",
          subdomains: "abc",
          maxZoom: 19,
        };
    }
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [60.75, 14.85],
      zoom: 8,
      minZoom: 6,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    map.fitBounds(
      [
        [59.95, 12.8],
        [62.25, 16.65],
      ],
      { padding: [20, 20] }
    );

    mapInstanceRef.current = map;

    const tileCfg = getTileConfig(tileMode);
    currentTileLayerRef.current = L.tileLayer(tileCfg.url, {
      attribution: tileCfg.attribution,
      subdomains: tileCfg.subdomains || "abc",
      maxZoom: tileCfg.maxZoom || 18,
    }).addTo(map);

    // Invalidate size on mount and after delay to ensure tiles load
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);

    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);

    // Add municipality centroid labels layer
    const labelGroup = L.layerGroup().addTo(map);
    MUNICIPALITIES.forEach((m) => {
      const labelIcon = L.divIcon({
        className: "muni-label-marker",
        html: `<div style="
          background: rgba(10, 14, 23, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.8);
          pointer-events: none;
          text-shadow: 0 1px 2px rgba(0,0,0,0.9);
          letter-spacing: 0.02em;
          transform: translate(-50%, -50%);
          display: inline-block;
        ">${m.name}</div>`,
        iconSize: [0, 0],
      });
      L.marker([m.lat, m.lon], { icon: labelIcon, interactive: false }).addTo(labelGroup);
    });

    fetch("/data/dalarna_municipalities.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("GeoJSON not found");
        return res.json();
      })
      .then((geoData) => {
        const geoLayer = L.geoJSON(geoData, {
          style: (feature) => {
            const code = feature?.properties?.code;
            const muni = MUNICIPALITIES.find((m) => m.code === code);
            const risk = municipalityRisks?.[code];

            // Default heat shading matching screenshot: Älvdalen & Mora warm gradient, others dark
            let fillColor = "#0f172a";
            let fillOpacity = 0.25;

            if (risk) {
              fillColor = getRiskColor(risk.level);
              fillOpacity = risk.level === "Critical" ? 0.75 : risk.level === "High" ? 0.65 : 0.45;
            } else if (muni?.name === "Älvdalen") {
              fillColor = "#b91c1c";
              fillOpacity = 0.62;
            } else if (muni?.name === "Mora") {
              fillColor = "#9a3412";
              fillOpacity = 0.48;
            } else if (muni?.name === "Orsa") {
              fillColor = "#854d0e";
              fillOpacity = 0.35;
            }

            const isSelected = code === selectedCode;

            return {
              fillColor,
              fillOpacity,
              color: isSelected ? "#38bdf8" : "#ffffff",
              weight: isSelected ? 3 : 1.5,
              opacity: isSelected ? 1 : 0.85,
              dashArray: isSelected ? "" : "4, 4",
            };
          },
          onEachFeature: (feature, layer) => {
            const code = feature.properties?.code;
            const muni = MUNICIPALITIES.find((m) => m.code === code);

            layer.on({
              mouseover: (e) => {
                const target = e.target;
                target.setStyle({
                  weight: 3,
                  color: "#38bdf8",
                  dashArray: "",
                  fillOpacity: 0.85,
                });
                target.bringToFront();

                if (muni) {
                  setHoveredMuni({
                    name: muni.name,
                    code: muni.code,
                    population: muni.population,
                    density: muni.density,
                    risk: municipalityRisks?.[code],
                  });
                }
              },
              mouseout: () => {
                if (geojsonLayerRef.current) {
                  geojsonLayerRef.current.resetStyle(layer);
                }
                setHoveredMuni(null);
              },
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                setSelectedCode(code);
                if (onSelectMunicipality) onSelectMunicipality(code);
              },
            });
          },
        }).addTo(map);

        geojsonLayerRef.current = geoLayer;
        labelGroup.eachLayer((l: any) => l.bringToFront?.());
      })
      .catch((err) => console.error("Error loading Dalarna GeoJSON:", err));

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update styles when risks change
  useEffect(() => {
    if (geojsonLayerRef.current) {
      geojsonLayerRef.current.eachLayer((layer: any) => {
        const code = layer.feature?.properties?.code;
        const risk = municipalityRisks?.[code];
        const fillColor = risk ? getRiskColor(risk.level) : "#1e293b";
        const isSelected = code === selectedCode;

        layer.setStyle({
          fillColor,
          fillOpacity: risk ? 0.65 : 0.45,
          color: isSelected ? "#38bdf8" : "#ffffff",
          weight: isSelected ? 3 : 1.5,
          opacity: isSelected ? 1 : 0.75,
          dashArray: isSelected ? "" : "3",
        });
      });
    }
  }, [municipalityRisks, selectedCode]);

  function switchTile(mode: "satellite" | "dark" | "osm") {
    setTileMode(mode);
    if (!mapInstanceRef.current || !currentTileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    const cfg = getTileConfig(mode);
    currentTileLayerRef.current = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains || "abc",
      maxZoom: cfg.maxZoom || 18,
    }).addTo(mapInstanceRef.current);

    if (geojsonLayerRef.current) {
      geojsonLayerRef.current.bringToFront();
    }
    mapInstanceRef.current.invalidateSize();
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#080c14",
      }}
    >
      {/* Map DOM node */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />

      {/* Top Left Header Card */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          background: "rgba(8,12,20,0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(99,122,180,0.25)",
          borderRadius: 8,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 500,
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ fontSize: 16 }}>🗺️</span>
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Region Dalarna — Official Boundary & Satellite Map
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
            15 Municipalities · SCB 2024 Geodata · SMHI Stora Spånsberget A Feeds
          </div>
        </div>
      </div>

      {/* Layer Tile Switcher Top Right */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          background: "rgba(8,12,20,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(99,122,180,0.25)",
          borderRadius: 8,
          padding: "3px 4px",
          display: "flex",
          gap: 4,
          zIndex: 500,
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        {[
          { key: "satellite", label: "Satellite", icon: "🌐" },
          { key: "dark", label: "Dark", icon: "🟣" },
          { key: "osm", label: "Street", icon: "🗺️" },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => switchTile(key as any)}
            style={{
              padding: "5px 11px",
              border: "none",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: tileMode === key ? "#2563eb" : "transparent",
              color: tileMode === key ? "#ffffff" : "#94a3b8",
              transition: "all 0.18s",
            }}
          >
            <span style={{ fontSize: 11 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Zoom and Fit Controls */}
      <div
        style={{
          position: "absolute",
          top: 66,
          right: 14,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          zIndex: 500,
        }}
      >
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          title="Zoom In"
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: "rgba(13,20,37,0.92)",
            border: "1px solid var(--border)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          title="Zoom Out"
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: "rgba(13,20,37,0.92)",
            border: "1px solid var(--border)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          –
        </button>
        <button
          onClick={() =>
            mapInstanceRef.current?.fitBounds(
              [
                [59.95, 12.8],
                [62.25, 16.65],
              ],
              { padding: [20, 20] }
            )
          }
          title="Fit Dalarna Bounds"
          style={{
            width: 30,
            height: 28,
            borderRadius: 6,
            background: "rgba(13,20,37,0.92)",
            border: "1px solid var(--border)",
            color: "#94a3b8",
            fontWeight: 800,
            fontSize: 10,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          FIT
        </button>
      </div>

      {/* Hover Info Card */}
      {hoveredMuni && (
        <div
          style={{
            position: "absolute",
            top: 76,
            left: 14,
            background: "rgba(8,12,20,0.95)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(56,189,248,0.4)",
            borderRadius: 10,
            padding: "12px 16px",
            minWidth: 220,
            zIndex: 500,
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 900, color: "var(--text-primary)" }}>
              {hoveredMuni.name}
            </span>
            <span style={{ fontSize: 10, color: "var(--accent-blue)", fontWeight: 700 }}>
              Code: {hoveredMuni.code}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 2 }}>
            Population (2024): <strong>{hoveredMuni.population.toLocaleString()}</strong>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 6 }}>
            Density: <strong>{hoveredMuni.density} inhab/km²</strong>
          </div>
          {hoveredMuni.risk ? (
            <div
              style={{
                marginTop: 6,
                padding: "6px 8px",
                borderRadius: 6,
                background: `${getRiskColor(hoveredMuni.risk.level)}18`,
                border: `1px solid ${getRiskColor(hoveredMuni.risk.level)}45`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: getRiskColor(hoveredMuni.risk.level),
                }}
              >
                {hoveredMuni.risk.level} Vulnerability
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: getRiskColor(hoveredMuni.risk.level),
                }}
              >
                {(hoveredMuni.risk.score * 100).toFixed(0)}%
              </span>
            </div>
          ) : (
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>
              Baseline Mode · Run simulation to see risk score
            </div>
          )}
        </div>
      )}

      {/* Vulnerability Scale Legend Bottom Centered */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(8,12,20,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(99,122,180,0.25)",
          borderRadius: 8,
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          zIndex: 500,
          boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          VULNERABILITY SCALE:
        </span>
        {[
          { label: "Low", color: "#10b981" },
          { label: "Medium", color: "#f59e0b" },
          { label: "High", color: "#ef4444" },
          { label: "Critical", color: "#7c3aed" },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 6px ${color}`,
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#cbd5e1" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
