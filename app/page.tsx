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
  Radio,
  Database,
  SlidersVertical,
  Building2,
  HelpCircle,
} from "lucide-react";
import TopDataSourcesBar from "@/components/TopDataSourcesBar";
import DataSourcesTab from "@/components/DataSourcesTab";
import SimulationTab from "@/components/SimulationTab";
import MunicipalitiesTab from "@/components/MunicipalitiesTab";
import HowItWorksModal from "@/components/HowItWorksModal";
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
  const [activeMode, setActiveMode] = useState<"live" | "simulation">("simulation");
  const [activeTab, setActiveTab] = useState<"sources" | "simulation" | "municipalities">("simulation");
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const [liveData, setLiveData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulationInsight, setSimulationInsight] = useState<any>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const smhiTemp = liveData?.smhi?.temperature ?? 1.7;
  const roadTemp = liveData?.trafikverket?.mean_road_temp ?? 1.3;

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
          height: 52,
          background: "rgba(8, 12, 20, 0.98)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
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
              background: "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.25))",
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
            onClick={() => {
              setActiveMode("live");
              setActiveTab("sources");
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
        <div style={{ display: "flex", gap: 14, marginLeft: "auto", alignItems: "center" }}>
          {/* SMHI Borlänge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
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
              <div style={{ fontSize: 13, fontWeight: 900, color: "#f59e0b" }}>
                {typeof smhiTemp === "number" ? smhiTemp.toFixed(1) : smhiTemp} °C
              </div>
            </div>
          </div>

          {/* Road Temp */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
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
              <div style={{ fontSize: 13, fontWeight: 900, color: "#22c55e" }}>
                {typeof roadTemp === "number" ? roadTemp.toFixed(1) : roadTemp} °C
              </div>
            </div>
          </div>

          {/* Operational Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 9px",
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
            style={{ padding: "5px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing…" : "Sync"}</span>
          </button>

          {/* Senior Admin Link */}
          <Link href="/admin" style={{ textDecoration: "none" }}>
            <button
              className="btn-ghost"
              style={{
                padding: "5px 12px",
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
        </div>
      </nav>

      {/* Top 6 Horizontal Data Source Cards */}
      <TopDataSourcesBar liveData={liveData} />

      {/* Main Split Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Map Viewport */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <DynamicDalarnaMap municipalityRisks={mapRisks} />

          {/* Active Simulation Floating Card */}
          {simulationResult && (
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
                boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
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
                  Active Simulation: {simulationResult.target_year} Horizon
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

        {/* Right Dashboard Sidebar */}
        <div
          style={{
            width: 530,
            minWidth: 500,
            height: "100%",
            background: "rgba(8, 12, 20, 0.98)",
            borderLeft: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "-4px 0 24px rgba(0,0,0,0.5)",
          }}
        >
          {/* Top Panel Tabs + How It Works Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(10,16,28,0.9)",
              borderBottom: "1px solid var(--border)",
              padding: "0 14px",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
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
                    padding: "11px 12px 9px",
                    border: "none",
                    borderBottom: activeTab === id ? "2px solid #2563eb" : "2px solid transparent",
                    background: "transparent",
                    color: activeTab === id ? "#38bdf8" : "var(--text-muted)",
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

            {/* How it works link */}
            <button
              onClick={() => setShowHowItWorks(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "transparent",
                border: "none",
                color: "#38bdf8",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                padding: "6px 8px",
              }}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How it works?</span>
            </button>
          </div>

          {/* Panel Scrollable Content */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: 14 }}>
            {activeTab === "simulation" && (
              <SimulationTab
                onResult={(res, insight) => {
                  setSimulationResult(res);
                  setSimulationInsight(insight);
                  setActiveMode("simulation");
                }}
              />
            )}

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
                  {isMounted && lastSyncTime && (
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
              </div>
            )}

            {activeTab === "municipalities" && (
              <MunicipalitiesTab
                simulationData={simulationResult?.municipalities}
                year={simulationResult?.target_year ?? 2024}
              />
            )}
          </div>
        </div>
      </div>

      {/* How It Works Modal */}
      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </div>
  );
}
