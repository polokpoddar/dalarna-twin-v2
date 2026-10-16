"use client";

import React from "react";
import { DATA_SOURCES } from "@/lib/constants";
import {
  Users,
  Car,
  Compass,
  TreePine,
  Droplets,
  CloudSun,
  Clock,
  Database,
  AlertCircle,
} from "lucide-react";

interface DataSourcesTabProps {
  data: any;
  loading: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  scb: <Users className="w-4 h-4 text-blue-400" />,
  trafikverket: <Car className="w-4 h-4 text-amber-400" />,
  lantmateriet: <Compass className="w-4 h-4 text-emerald-400" />,
  skogsstyrelsen: <TreePine className="w-4 h-4 text-purple-400" />,
  sgu: <Droplets className="w-4 h-4 text-cyan-400" />,
  smhi: <CloudSun className="w-4 h-4 text-pink-400" />,
};

const METRICS_MAP: Record<string, (d: any) => Array<{ label: string; value: string }>> = {
  scb: (d) => [
    { label: "Population", value: `${d.scb?.total_population?.toLocaleString() ?? 287387} inhab.` },
    { label: "Scope", value: `${d.scb?.municipalities_count ?? 15} municipalities` },
    { label: "Trend", value: d.scb?.growth_trend ?? "stable +0.3% YoY" },
  ],
  trafikverket: (d) => [
    { label: "Road Temp", value: `${(d.trafikverket?.mean_road_temp ?? 9.2).toFixed(1)} °C` },
    { label: "Ice Sensors", value: `${d.trafikverket?.ice_count ?? 0} active alerts` },
    { label: "Stations", value: `${d.trafikverket?.total_stations ?? 42} VViS sites` },
  ],
  lantmateriet: (d) => [
    { label: "Parcels", value: `${(d.lantmateriet?.records ?? 148200).toLocaleString()} units` },
    { label: "Permits", value: `${d.lantmateriet?.active_permits ?? 145} active` },
    { label: "Territory", value: `${(d.lantmateriet?.coverage_area_km2 ?? 28194).toLocaleString()} km²` },
  ],
  skogsstyrelsen: (d) => [
    { label: "Inventory", value: `${(d.skogsstyrelsen?.records ?? 2420).toLocaleString()} stands` },
    { label: "Fellings", value: `${d.skogsstyrelsen?.felling_notices ?? 58} notices/yr` },
    { label: "Canopy Index", value: `${((d.skogsstyrelsen?.biodiversity_index ?? 0.72) * 100).toFixed(0)}% integrity` },
  ],
  sgu: (d) => [
    { label: "Aquifers", value: `${d.sgu?.total_bodies ?? 88} bodies` },
    { label: "Monitoring", value: `${(d.sgu?.total_area_km2 ?? 6450).toLocaleString()} km²` },
    { label: "Water Level", value: d.sgu?.groundwater_level ?? "normal" },
  ],
  smhi: (d) => [
    { label: "Air Temp", value: `${(d.smhi?.temperature ?? 9.6).toFixed(1)} °C` },
    { label: "Precipitation", value: `${(d.smhi?.precipitation ?? 0.0).toFixed(1)} mm/h` },
    { label: "Wind Speed", value: `${(d.smhi?.wind_speed ?? 2.0).toFixed(1)} m/s` },
  ],
};

export default function DataSourcesTab({ data, loading }: DataSourcesTabProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
      {DATA_SOURCES.map((source) => {
        const metrics = data ? METRICS_MAP[source.id]?.(data) || [] : [];
        const status = data ? data[source.id]?.status || "online" : "loading";
        const isDisabled = status === "disabled";

        return (
          <div
            key={source.id}
            className="glass-card"
            style={{
              padding: "12px 14px",
              opacity: isDisabled ? 0.6 : 1,
              border: isDisabled ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid var(--border)",
              background: isDisabled ? "rgba(239, 68, 68, 0.04)" : "rgba(13, 20, 37, 0.75)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 148,
              borderRadius: 10,
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: `${source.color}18`,
                      border: `1px solid ${source.color}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {ICON_MAP[source.id]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        lineHeight: 1.2,
                      }}
                    >
                      {source.name}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.2 }}>
                      {source.role.split("&")[0]}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span
                    className="status-dot"
                    style={{
                      background: isDisabled
                        ? "#ef4444"
                        : status === "online"
                        ? "var(--risk-low)"
                        : "var(--text-muted)",
                      boxShadow: isDisabled
                        ? "0 0 6px rgba(239,68,68,0.6)"
                        : status === "online"
                        ? "0 0 6px var(--risk-low)"
                        : "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: isDisabled ? "#ef4444" : "var(--risk-low)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {isDisabled ? "OFF" : "LIVE"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  height: 2,
                  background: isDisabled
                    ? "rgba(239, 68, 68, 0.4)"
                    : `linear-gradient(90deg, ${source.color}, transparent)`,
                  borderRadius: 99,
                  marginBottom: 8,
                }}
              />

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="shimmer" style={{ height: 12, width: "85%", borderRadius: 4 }} />
                  <div className="shimmer" style={{ height: 12, width: "65%", borderRadius: 4 }} />
                  <div className="shimmer" style={{ height: 12, width: "75%", borderRadius: 4 }} />
                </div>
              ) : isDisabled ? (
                <div
                  style={{
                    padding: "10px 0",
                    fontSize: 11,
                    color: "#f87171",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Excluded in Senior Control Panel</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {metrics.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>{m.label}</span>
                      <span
                        style={{
                          color: idx === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                          fontWeight: idx === 0 ? 700 : 500,
                        }}
                      >
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 8,
                paddingTop: 6,
                borderTop: "1px solid rgba(99, 122, 180, 0.12)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 9,
                color: "var(--text-muted)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Clock className="w-3 h-3" /> {source.updateFrequency}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Database className="w-3 h-3" /> {source.records.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
