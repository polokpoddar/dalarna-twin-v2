"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Globe,
  Activity,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Thermometer,
  CloudRain,
  TriangleAlert,
  Radio,
  Database,
  SlidersVertical,
  Building2,
} from "lucide-react";
import DataSourcesTab from "@/components/DataSourcesTab";
import SimulationTab from "@/components/SimulationTab";
import MunicipalitiesTab from "@/components/MunicipalitiesTab";
import { RiskLevel, SimulationResult } from "@/lib/types";

const DynamicDalarnaMap = dynamic(() => import("@/components/DalarnaMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#080c14",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: 13,
        gap: 8,
      }}
    >
      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
      <span>Initializing Regional Geodata & Satellites…</span>
    </div>
  ),
});

export default function Home() {
  const [activeMode, setActiveMode] = useState<"live" | "simulation">("live");
  const [activeTab, setActiveTab] = useState<"sources" | "simulation" | "municipalities">("sources");

  const [liveData, setLiveData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulationInsight, setSimulationInsight] = useState<any>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchLiveTelemetry = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsSyncing(true);
    try {
      const res = await fetch("/api/live-data");
      const json = await res.json();
      if (json.success) {
        setLiveData(json.data);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error("Live data error:", err);
    } finally {
      setDataLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveTelemetry(true);
    const interval = setInterval(() => fetchLiveTelemetry(true), 300000);
    return () => clearInterval(interval);
  }, [fetchLiveTelemetry]);

  const mapRisks: Record<string, RiskLevel> | undefined = simulationResult
    ? Object.fromEntries(simulationResult.municipalities.map((m) => [m.code, m.overall_risk]))
    : undefined;

  const smhiTemp = liveData?.smhi?.temperature;
  const roadTemp = liveData?.trafikverket?.mean_road_temp;
  const iceCount = liveData?.trafikverket?.ice_count;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-primary)",
      }}
    >
      {/* Top Navbar */}
      <nav
        style={{
          height: 54,
          background: "rgba(8, 12, 20, 0.96)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))",
              border: "1px solid rgba(59,130,246,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                letterSpacing: "0.02em",
              }}
            >
              Region Dalarna Digital Twin
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.2 }}>
              Regional Intelligence & Multi-Hazard Simulation Platform
            </div>
          </div>
        </div>

        {/* Mode Toggle Switcher */}
        <div
          style={{
            display: "flex",
            background: "rgba(99,122,180,0.12)",
            borderRadius: 8,
            padding: 3,
            gap: 3,
            marginLeft: 16,
          }}
        >
          <button
            onClick={() => setActiveMode("live")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              border: "none",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              background: activeMode === "live" ? "rgba(59,130,246,0.3)" : "transparent",
              color: activeMode === "live" ? "var(--accent-blue)" : "var(--text-muted)",
              transition: "all 0.18s",
            }}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Telemetry</span>
          </button>
          <button
            onClick={() => {
              setActiveMode("simulation");
              setActiveTab("simulation");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              border: "none",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              background: activeMode === "simulation" ? "rgba(139,92,246,0.3)" : "transparent",
              color: activeMode === "simulation" ? "#a78bfa" : "var(--text-muted)",
              transition: "all 0.18s",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Simulation Horizon</span>
          </button>
        </div>

        {/* Live Weather & Road Telemetry Pill Widgets */}
        <div style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
          {smhiTemp !== undefined && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(13,20,37,0.7)",
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}
            >
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.04em" }}>
                  SMHI BORLÄNGE
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: smhiTemp < 0 ? "#06b6d4" : "#f59e0b" }}>
                  {smhiTemp.toFixed(1)} °C
                </div>
              </div>
            </div>
          )}

          {roadTemp !== undefined && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(13,20,37,0.7)",
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.04em" }}>
                  ROAD TEMP
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: roadTemp < 0 ? "#ef4444" : "#22c55e" }}>
                  {roadTemp.toFixed(1)} °C
                </div>
              </div>
            </div>
          )}

          {iceCount !== undefined && iceCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(239,68,68,0.15)",
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <TriangleAlert className="w-3.5 h-3.5 text-red-400" />
              <div>
                <div style={{ fontSize: 9, color: "#fca5a5", fontWeight: 700 }}>BLACK ICE WARNING</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#ef4444" }}>{iceCount} Stations</div>
              </div>
            </div>
          )}
        </div>

        {/* Operational Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 8px",
            background: "rgba(34,197,94,0.1)",
            borderRadius: 6,
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
              boxShadow: "0 0 6px #22c55e",
            }}
          />
          <span style={{ fontSize: 10, fontWeight: 800, color: "#22c55e", letterSpacing: "0.05em" }}>
            OPERATIONAL
          </span>
        </div>

        {/* Sync Button */}
        <button
          className="btn-ghost"
          onClick={() => fetchLiveTelemetry()}
          disabled={isSyncing}
          style={{ padding: "6px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "Syncing…" : "Sync"}</span>
        </button>

        {/* Admin Link */}
        <Link href="/admin" style={{ textDecoration: "none" }}>
          <button
            className="btn-ghost"
            style={{
              padding: "6px 12px",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(99,122,180,0.1)",
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Senior Admin</span>
          </button>
        </Link>
      </nav>

      {/* Main Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Map Viewport (Left flex: 1) */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <DynamicDalarnaMap municipalityRisks={mapRisks} />

          {/* Active Simulation Floating Card */}
          {activeMode === "simulation" && simulationResult && (
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                background: "rgba(8, 12, 20, 0.94)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(139, 92, 246, 0.4)",
                borderRadius: 10,
                padding: "12px 16px",
                maxWidth: 320,
                zIndex: 500,
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#a78bfa",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Active Scenario: {simulationResult.target_year} Horizon
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                }}
              >
                {simulationResult.scenario.replace(/_/g, " ").toUpperCase()}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(simulationResult.summary.category_risks).map(([cat, risk]) => (
                  <div
                    key={cat}
                    style={{
                      background: "rgba(13,20,37,0.7)",
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      {cat.replace(/_risk/g, "").replace(/_/g, " ")}
                    </div>
                    <span
                      className={`risk-badge risk-${risk.toLowerCase()}`}
                      style={{ fontSize: 10, marginTop: 2 }}
                    >
                      {risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Dashboard Sidebar (480px) */}
        <div
          style={{
            width: 480,
            minWidth: 480,
            height: "100%",
            background: "rgba(8, 12, 20, 0.98)",
            borderLeft: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.4)",
          }}
        >
          {/* Top Panel Tabs */}
          <div
            style={{
              display: "flex",
              background: "rgba(13,20,37,0.85)",
              borderBottom: "1px solid var(--border)",
              padding: "0 14px",
              gap: 4,
            }}
          >
            {[
              { id: "sources", label: "Data Sources", icon: <Database className="w-3.5 h-3.5" /> },
              { id: "simulation", label: "Simulation", icon: <SlidersVertical className="w-3.5 h-3.5" /> },
              { id: "municipalities", label: "Municipalities", icon: <Building2 className="w-3.5 h-3.5" /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 14px 10px",
                  border: "none",
                  borderBottom: activeTab === id ? "2px solid var(--accent-blue)" : "2px solid transparent",
                  background: "transparent",
                  color: activeTab === id ? "var(--accent-blue)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                }}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Panel Scrollable Content */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: 16 }}>
            {activeTab === "sources" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-primary)" }}>
                      Regional Feeds & Repositories
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      Swedish National Open Data & Real Sensor Telemetry
                    </div>
                  </div>
                  {lastSyncTime && (
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Radio className="w-3 h-3 text-emerald-400" /> {lastSyncTime.toLocaleTimeString()}
                    </span>
                  )}
                </div>

                <DataSourcesTab data={liveData} loading={dataLoading} />

                {liveData && (
                  <div
                    style={{
                      marginTop: 6,
                      padding: 14,
                      background: "rgba(13,20,37,0.7)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <CloudRain className="w-4 h-4 text-blue-400" />
                        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>
                          SMHI Station 105220 · Stora Spånsberget A
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "var(--risk-low)",
                          background: "rgba(34,197,94,0.1)",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        LIVE METOBS
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                      {[
                        {
                          label: "Air Temp",
                          value: `${liveData.smhi.temperature.toFixed(1)} °C`,
                          color: liveData.smhi.temperature < 0 ? "#06b6d4" : "#f59e0b",
                        },
                        {
                          label: "Precip",
                          value: `${liveData.smhi.precipitation.toFixed(1)} mm`,
                          color: "#3b82f6",
                        },
                        {
                          label: "Wind",
                          value: `${liveData.smhi.wind_speed.toFixed(1)} m/s`,
                          color: "#8b5cf6",
                        },
                        {
                          label: "Humidity",
                          value: `${liveData.smhi.humidity}%`,
                          color: "#10b981",
                        },
                      ].map(({ label, value, color }) => (
                        <div
                          key={label}
                          style={{
                            textAlign: "center",
                            background: "rgba(8,12,20,0.6)",
                            padding: "8px 4px",
                            borderRadius: 6,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 9,
                              color: "var(--text-muted)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                            }}
                          >
                            {label}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 900, color, marginTop: 2 }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 10,
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                      }}
                    >
                      Station location: Borlänge / Dalarna (Lat 60.3817°, Lon 15.1374°, Alt 492m)
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "simulation" && (
              <div>
                <SimulationTab
                  onResult={(res, insight) => {
                    setSimulationResult(res);
                    setSimulationInsight(insight);
                    setActiveMode("simulation");
                  }}
                />
              </div>
            )}

            {activeTab === "municipalities" && (
              <div>
                <MunicipalitiesTab
                  simulationData={simulationResult?.municipalities}
                  year={simulationResult?.target_year ?? 2024}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
