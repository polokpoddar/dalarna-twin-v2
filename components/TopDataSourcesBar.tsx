"use client";

import React from "react";
import {
  Users,
  Anchor,
  Map as MapIcon,
  TreePine,
  Droplets,
  Cloud,
} from "lucide-react";

interface TopDataSourcesBarProps {
  liveData?: any;
}

export default function TopDataSourcesBar({ liveData }: TopDataSourcesBarProps) {
  const roadTemp = liveData?.trafikverket?.mean_road_temp !== undefined
    ? `${liveData.trafikverket.mean_road_temp.toFixed(1)} °C`
    : "1.8 °C";

  const iceAlerts = liveData?.trafikverket?.ice_count !== undefined
    ? `${liveData.trafikverket.ice_count} active alerts`
    : "0 active alerts";

  const airTemp = liveData?.smhi?.temperature !== undefined
    ? `${liveData.smhi.temperature.toFixed(1)} °C`
    : "2.2 °C";

  const precip = liveData?.smhi?.precipitation !== undefined
    ? `${liveData.smhi.precipitation.toFixed(1)} mm/h`
    : "0.3 mm/h";

  const wind = liveData?.smhi?.wind_speed !== undefined
    ? `${liveData.smhi.wind_speed.toFixed(1)} m/s`
    : "4.5 m/s";

  const cards = [
    {
      id: "scb",
      title: "SCB / Kolada",
      iconBg: "#7c3aed",
      icon: <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>SCB</span>,
      col1: [
        { label: "Population", value: "287,387 inhab.", isWhite: true },
        { label: "Table", value: "stable +0.3% YoY" },
      ],
      col2: [
        { label: "Scope", value: "15 municipalities" },
        { label: "Annual", value: "15" },
      ],
    },
    {
      id: "trafikverket",
      title: "Trafikverket",
      iconBg: "#dc2626",
      icon: <Anchor className="w-3.5 h-3.5 text-white" />,
      col1: [
        { label: "Road Temp", value: roadTemp, color: "#22c55e" },
        { label: "Stations", value: "42 VVIS sites", color: "#38bdf8" },
      ],
      col2: [
        { label: "Ice Sensors", value: iceAlerts, color: "#facc15" },
        { label: "Frequency", value: "15 minutes" },
      ],
    },
    {
      id: "lantmateriet",
      title: "Lantmäteriet",
      iconBg: "#0d9488",
      icon: <MapIcon className="w-3.5 h-3.5 text-white" />,
      col1: [
        { label: "Parcels", value: "148,200 units", isWhite: true },
        { label: "Territory", value: "28,194 km²" },
      ],
      col2: [
        { label: "Permits", value: "145 active", color: "#fb923c" },
        { label: "Frequency", value: "Daily" },
      ],
    },
    {
      id: "skogsstyrelsen",
      title: "Skogsstyrelsen",
      iconBg: "#16a34a",
      icon: <TreePine className="w-3.5 h-3.5 text-white" />,
      col1: [
        { label: "Inventory", value: "2,420 stands", isWhite: true },
        { label: "Canopy Index", value: "72% integrity" },
      ],
      col2: [
        { label: "Fellings", value: "58 notices/yr" },
        { label: "Frequency", value: "Daily" },
      ],
    },
    {
      id: "sgu",
      title: "SGU",
      iconBg: "#2563eb",
      icon: <Droplets className="w-3.5 h-3.5 text-white" />,
      col1: [
        { label: "Aquifers", value: "88 bodies", isWhite: true },
        { label: "Water Level", value: "normal", color: "#22c55e" },
      ],
      col2: [
        { label: "Monitoring", value: "6,450 km²", color: "#38bdf8" },
        { label: "Frequency", value: "6 hours" },
      ],
    },
    {
      id: "smhi",
      title: "SMHI",
      iconBg: "#0284c7",
      icon: <Cloud className="w-3.5 h-3.5 text-white" />,
      col1: [
        { label: "Air Temp", value: airTemp, isWhite: true },
        { label: "Wind Speed", value: wind },
      ],
      col2: [
        { label: "Precipitation", value: precip },
        { label: "Frequency", value: "15 minutes" },
      ],
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 8,
        padding: "8px 14px",
        background: "rgba(6, 10, 18, 0.95)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            background: "rgba(10, 15, 26, 0.85)",
            border: "1px solid rgba(99, 122, 180, 0.2)",
            borderRadius: 8,
            padding: "8px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {/* Card Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  background: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-primary)" }}>
                {card.title}
              </span>
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: "#22c55e",
                background: "rgba(34, 197, 94, 0.12)",
                padding: "1px 5px",
                borderRadius: 4,
                letterSpacing: "0.03em",
              }}
            >
              + LIVE
            </span>
          </div>

          {/* 2-column key metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 10 }}>
            {/* Col 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {card.col1.map((item, idx) => (
                <div key={idx} style={{ lineHeight: 1.15 }}>
                  <span style={{ color: "var(--text-muted)", fontSize: 9 }}>{item.label} </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: item.color || (item.isWhite ? "#ffffff" : "var(--text-secondary)"),
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Col 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {card.col2.map((item, idx) => (
                <div key={idx} style={{ lineHeight: 1.15 }}>
                  <span style={{ color: "var(--text-muted)", fontSize: 9 }}>{item.label} </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: (item as any).color || "var(--text-secondary)",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
