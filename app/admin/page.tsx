"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  BarChart3,
  Database,
  SlidersVertical,
  ClipboardList,
  ArrowLeft,
  CircleCheck,
  Clock,
  Layers,
  Activity,
  Users,
  Car,
  Compass,
  TreePine,
  Droplets,
  CloudSun,
  RefreshCw,
  RotateCcw,
  Download,
  Zap,
  Gauge,
  Check,
} from "lucide-react";
import { DATA_SOURCES } from "@/lib/constants";
import { SystemState } from "@/lib/types";

const FEED_ICONS: Record<string, React.ReactNode> = {
  scb: <Users className="w-5 h-5 text-blue-400" />,
  trafikverket: <Car className="w-5 h-5 text-amber-400" />,
  lantmateriet: <Compass className="w-5 h-5 text-emerald-400" />,
  skogsstyrelsen: <TreePine className="w-5 h-5 text-purple-400" />,
  sgu: <Droplets className="w-5 h-5 text-cyan-400" />,
  smhi: <CloudSun className="w-5 h-5 text-pink-400" />,
};

export default function AdminPage() {
  const [state, setState] = useState<SystemState | null>(null);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notification, setNotification] = useState<string | null>(null);

  async function loadState() {
    try {
      const res = await fetch("/api/control");
      const data = await res.json();
      if (data.success) setState(data.state);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadAuditLog() {
    try {
      const res = await fetch("/api/control", { method: "PUT" });
      const data = await res.json();
      if (data.success) setAuditLog(data.audit_log);
    } catch (err) {
      console.error(err);
    }
  }

  async function sendAction(action: string, payload: any = {}) {
    try {
      const res = await fetch("/api/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload, user: "admin" }),
      });
      const data = await res.json();
      if (data.success) {
        setState(data.state);
        showNotification(`Applied: ${action.replace(/_/g, " ")} (v${data.state.version})`);
      }
    } catch (err) {
      console.error(err);
      showNotification("Error updating administrative configuration");
    }
  }

  function showNotification(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  }

  function handleBulkToggle(enabled: boolean) {
    if (state) {
      const newSources = { ...state.sources };
      Object.keys(newSources).forEach((k) => (newSources[k] = enabled));
      setState({ ...state, sources: newSources });
    }
    sendAction("bulk_toggle_sources", { enabled });
  }

  function handleSetMode(mode: "live" | "simulation" | "emergency") {
    if (state) setState({ ...state, mode });
    sendAction("set_mode", { mode });
  }

  function applyPreset(low: number, medium: number, high: number, name: string) {
    const thresholds = { low, medium, high };
    if (state) setState({ ...state, risk_thresholds: thresholds });
    sendAction("update_thresholds", { thresholds });
    showNotification(`Applied preset: ${name}`);
  }

  useEffect(() => {
    loadState();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Activity className="w-5 h-5 text-blue-400 animate-spin" />
          <span>Initializing Senior Administrative Control Console…</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 9999,
            background: "rgba(34,197,94,0.18)",
            border: "1px solid rgba(34,197,94,0.45)",
            borderRadius: 8,
            padding: "10px 16px",
            fontSize: 12,
            fontWeight: 700,
            color: "#f1f5f9",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <CircleCheck className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <nav
        style={{
          height: 56,
          background: "rgba(8,12,20,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 16,
          flexShrink: 0,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Live Twin</span>
          </button>
        </Link>

        <div style={{ width: 1, height: 24, background: "var(--border)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
              Senior Administrative Control Console
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
              Policy Governance, Data Telemetry & Engine Calibration
            </div>
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => {
              sendAction("flush_cache");
              showNotification("Telemetry cache cleared. Live feeds resynchronized.");
            }}
            className="btn-ghost"
            style={{ padding: "6px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}
            title="Flush telemetry cache and resynchronize with SMHI & official open APIs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Resync Feeds</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Reset all Senior Control configurations to official regional baselines?")) {
                sendAction("reset_defaults");
              }
            }}
            className="btn-ghost"
            style={{ padding: "6px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}
            title="Reset all settings to baseline regional parameters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => {
              if (!state) return;
              const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
              const downloadAnchor = document.createElement("a");
              downloadAnchor.setAttribute("href", jsonStr);
              downloadAnchor.setAttribute("download", `dalarna_digital_twin_config_v${state.version}.json`);
              downloadAnchor.click();
            }}
            className="btn-ghost"
            style={{ padding: "6px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}
            title="Export full system state as JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export JSON</span>
          </button>

          <div style={{ width: 1, height: 20, background: "var(--border)" }} />

          {state && (
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              v{state.version} · {state.applied_by}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 8px",
              background: "rgba(34,197,94,0.1)",
              borderRadius: 6,
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
                boxShadow: "0 0 6px #22c55e",
              }}
            />
            <span style={{ fontSize: 10, fontWeight: 800, color: "#22c55e" }}>MASTER CONTROL</span>
          </div>
        </div>
      </nav>

      {/* Admin Content Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Nav (240px) */}
        <div
          style={{
            width: 240,
            background: "rgba(13,20,37,0.85)",
            borderRight: "1px solid var(--border)",
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0 8px",
              marginBottom: 8,
            }}
          >
            Administrative Domain
          </div>

          {[
            { id: "overview", label: "System Overview", icon: <BarChart3 className="w-4 h-4" /> },
            { id: "sources", label: "Data Feeds Governance", icon: <Database className="w-4 h-4" /> },
            { id: "mode", label: "Operational Mode & Scope", icon: <Zap className="w-4 h-4" /> },
            { id: "thresholds", label: "Risk Thresholds", icon: <SlidersVertical className="w-4 h-4" /> },
            { id: "layers", label: "Geospatial Layers", icon: <Layers className="w-4 h-4" /> },
            { id: "sensitivity", label: "Engine Sensitivity", icon: <Gauge className="w-4 h-4" /> },
            { id: "audit", label: "Audit Log & History", icon: <ClipboardList className="w-4 h-4" /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                if (id === "audit") loadAuditLog();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                background: activeTab === id ? "rgba(59,130,246,0.18)" : "transparent",
                color: activeTab === id ? "var(--accent-blue)" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 700,
                transition: "all 0.18s",
              }}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Viewport Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && state && (
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>
                Regional Twin Governance Overview
              </h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>
                Active administrative telemetry, security bounds, and operational controls for Region Dalarna.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Configuration Version", value: `v${state.version}`, color: "#3b82f6" },
                  {
                    label: "Active Regional Feeds",
                    value: `${Object.values(state.sources).filter(Boolean).length} / 6`,
                    color: "#22c55e",
                  },
                  {
                    label: "Operational State",
                    value: state.mode.toUpperCase(),
                    color: state.mode === "emergency" ? "#ef4444" : "#f59e0b",
                  },
                  { label: "Engine Baseline Horizon", value: `${state.simulation_year}`, color: "#a855f7" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="glass-card" style={{ padding: 18, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        marginTop: 4,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Mode Switcher */}
              <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>
                  Quick Operational State Switcher
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    {
                      id: "live",
                      title: "Live Monitoring",
                      desc: "Routine telemetry polling from SMHI & open sensors",
                      color: "#22c55e",
                    },
                    {
                      id: "simulation",
                      title: "Stress Simulation",
                      desc: "Cross-hazard predictive scenarios enabled",
                      color: "#3b82f6",
                    },
                    {
                      id: "emergency",
                      title: "Emergency Advisory",
                      desc: "Heightened sensitivity and instant contingency alerts",
                      color: "#ef4444",
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSetMode(m.id as any)}
                      style={{
                        padding: 14,
                        borderRadius: 8,
                        textAlign: "left",
                        cursor: "pointer",
                        border: state.mode === m.id ? `2px solid ${m.color}` : "1px solid var(--border)",
                        background: state.mode === m.id ? `${m.color}15` : "rgba(13,20,37,0.5)",
                        transition: "all 0.18s",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: m.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{m.title}</span>
                        {state.mode === m.id && <Check className="w-4 h-4" />}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4 }}>
                        {m.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Feeds List Overview */}
              <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
                    Data Feeds Status & Polling Intervals
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleBulkToggle(true)}
                      className="btn-ghost"
                      style={{ padding: "4px 8px", fontSize: 10 }}
                    >
                      Enable All
                    </button>
                    <button
                      onClick={() => handleBulkToggle(false)}
                      className="btn-ghost"
                      style={{ padding: "4px 8px", fontSize: 10 }}
                    >
                      Disable All
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {DATA_SOURCES.map((source) => {
                    const isActive = state.sources[source.id];
                    const interval = state.source_intervals[source.id] || 900;
                    return (
                      <div
                        key={source.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "8px 10px",
                          background: "rgba(99,122,180,0.06)",
                          borderRadius: 6,
                        }}
                      >
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 6,
                            background: `${source.color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {FEED_ICONS[source.id]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>
                            {source.fullName}
                          </div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{source.role}</div>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                          Interval: {interval >= 3600 ? `${interval / 3600}h` : `${interval / 60}m`}
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: isActive ? "var(--risk-low)" : "#ef4444",
                            minWidth: 60,
                            textAlign: "right",
                          }}
                        >
                          {isActive ? "ACTIVE" : "EXCLUDED"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA FEEDS GOVERNANCE */}
          {activeTab === "sources" && state && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>
                    Regional Telemetry Feeds Governance
                  </h1>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Enable, disable, or adjust sampling intervals for Swedish regional data providers.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleBulkToggle(true)}
                    className="btn-primary"
                    style={{ padding: "6px 12px", fontSize: 11 }}
                  >
                    Enable All Feeds
                  </button>
                  <button
                    onClick={() => handleBulkToggle(false)}
                    className="btn-ghost"
                    style={{ padding: "6px 12px", fontSize: 11, borderColor: "#ef4444", color: "#ef4444" }}
                  >
                    Disable All
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {DATA_SOURCES.map((source) => {
                  const isActive = state.sources[source.id];
                  const interval = state.source_intervals[source.id] || 900;

                  return (
                    <div
                      key={source.id}
                      className="glass-card"
                      style={{
                        padding: "18px 22px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 16,
                        border: isActive ? "1px solid var(--border)" : "1px solid rgba(239, 68, 68, 0.3)",
                        background: isActive ? "rgba(13,20,37,0.75)" : "rgba(239,68,68,0.03)",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: `${source.color}18`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {FEED_ICONS[source.id]}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: "var(--text-primary)" }}>
                            {source.fullName}
                          </div>
                          <span className={`risk-badge ${isActive ? "risk-low" : "risk-no_data"}`}>
                            {isActive ? "Active" : "Excluded"}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>
                          {source.role}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-secondary)",
                            lineHeight: 1.5,
                            marginBottom: 12,
                          }}
                        >
                          {source.description}
                        </div>

                        <div style={{ display: "flex", gap: 24, fontSize: 11, color: "var(--text-muted)", alignItems: "center" }}>
                          <span>
                            Records: <strong>{source.records.toLocaleString()}</strong>
                          </span>
                          <span>
                            Default: <strong>{source.updateFrequency}</strong>
                          </span>
                          <span>
                            Baseline: <strong>{source.baselinePeriod}</strong>
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span>Polling Rate:</span>
                            <select
                              value={interval}
                              onChange={(e) => {
                                const secs = Number(e.target.value);
                                setState({
                                  ...state,
                                  source_intervals: { ...state.source_intervals, [source.id]: secs },
                                });
                                sendAction("update_interval", { sourceId: source.id, seconds: secs });
                              }}
                              style={{
                                background: "rgba(99,122,180,0.15)",
                                border: "1px solid var(--border)",
                                borderRadius: 6,
                                color: "var(--text-primary)",
                                padding: "2px 8px",
                                fontSize: 11,
                                outline: "none",
                              }}
                            >
                              <option value={300}>Every 5 minutes</option>
                              <option value={900}>Every 15 minutes</option>
                              <option value={3600}>Every 1 hour</option>
                              <option value={21600}>Every 6 hours</option>
                              <option value={86400}>Daily (24 hours)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setState({
                                ...state,
                                sources: { ...state.sources, [source.id]: checked },
                              });
                              sendAction("toggle_source", { sourceId: source.id, enabled: checked });
                            }}
                          />
                          <span className="toggle-slider" />
                        </label>
                        <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? "var(--risk-low)" : "#ef4444" }}>
                          {isActive ? "ENABLED" : "EXCLUDED"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: OPERATIONAL MODE */}
          {activeTab === "mode" && state && (
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>
                Operational Mode & Target Time Horizon
              </h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>
                Define how the platform handles predictive models and emergency thresholds.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                {[
                  {
                    id: "live",
                    title: "Live Monitoring Mode (Standard Operating Procedure)",
                    desc: "System ingests raw real-time telemetry from SMHI automatic station 105220, Trafikverket VViS road temperature sensors, and SCB 2024 census records. Municipal risk profiles are based on current empirical conditions.",
                    badge: "RECOMMENDED FOR DAILY OPS",
                    color: "#22c55e",
                  },
                  {
                    id: "simulation",
                    title: "Cross-Sector Simulation Mode (Strategic Planning)",
                    desc: "Activates the multi-criteria spatial stress-testing engine. Users can perturb climate, transit disruptions, and population influx to project vulnerability across all 15 municipalities.",
                    badge: "PLANNING & THESIS PRESENTATION",
                    color: "#3b82f6",
                  },
                  {
                    id: "emergency",
                    title: "Emergency Contingency Advisory (Civil Defense)",
                    desc: "Strict safety margins applied. Any municipal vulnerability score exceeding 70% automatically generates contingency warnings for Dalarna County Board (Länsstyrelsen) and local rescue services.",
                    badge: "CRISIS ADVISORY",
                    color: "#ef4444",
                  },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSetMode(m.id as any)}
                    className="glass-card"
                    style={{
                      padding: 18,
                      cursor: "pointer",
                      border: state.mode === m.id ? `2px solid ${m.color}` : "1px solid var(--border)",
                      background: state.mode === m.id ? `${m.color}12` : "rgba(13,20,37,0.7)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.title}</div>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: `${m.color}25`,
                          color: m.color,
                        }}
                      >
                        {m.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {m.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Default Horizon */}
              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
                  Default Simulation Target Year
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}>
                  Sets the default time horizon for demographic expansion, climate warming anomalies, and infrastructure aging.
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {[2025, 2030, 2035, 2040, 2050].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => {
                        setState({ ...state, simulation_year: yr });
                        sendAction("apply_state", { simulation_year: yr });
                      }}
                      className={state.simulation_year === yr ? "btn-primary" : "btn-ghost"}
                      style={{ flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 800 }}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RISK THRESHOLDS */}
          {activeTab === "thresholds" && state && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>
                    Risk Classification Calibration
                  </h1>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Configure the quantitative cutoff thresholds dividing Low, Medium, High, and Critical municipal tiers.
                  </p>
                </div>
              </div>

              {/* Presets */}
              <div className="glass-card" style={{ padding: 18, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }}>
                  Pre-Configured Governance Presets
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <button
                    onClick={() => applyPreset(0.3, 0.6, 0.8, "Swedish MSB Standard")}
                    className="btn-ghost"
                    style={{ padding: 10, textAlign: "left", display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: "var(--accent-blue)" }}>
                      Swedish MSB Standard
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      Low &lt;30% · Med &lt;60% · High &lt;80%
                    </span>
                  </button>

                  <button
                    onClick={() => applyPreset(0.2, 0.45, 0.7, "Precautionary Climate Framework")}
                    className="btn-ghost"
                    style={{ padding: 10, textAlign: "left", display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#f59e0b" }}>
                      Precautionary Climate
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      Low &lt;20% · Med &lt;45% · High &lt;70%
                    </span>
                  </button>

                  <button
                    onClick={() => applyPreset(0.35, 0.65, 0.85, "Urban Stress Resilient")}
                    className="btn-ghost"
                    style={{ padding: 10, textAlign: "left", display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#22c55e" }}>
                      Urban Stress Resilient
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      Low &lt;35% · Med &lt;65% · High &lt;85%
                    </span>
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    key: "low",
                    label: "Low Risk Upper Cutoff",
                    val: state.risk_thresholds.low,
                    color: "var(--risk-low)",
                    desc: "Municipalities below this percentage are green (Routine Capacity).",
                  },
                  {
                    key: "medium",
                    label: "Medium Risk Upper Cutoff",
                    val: state.risk_thresholds.medium,
                    color: "var(--risk-medium)",
                    desc: "Municipalities between Low and Medium are yellow (Elevated Vigilance).",
                  },
                  {
                    key: "high",
                    label: "High Risk Cutoff (Critical Floor)",
                    val: state.risk_thresholds.high,
                    color: "var(--risk-high)",
                    desc: "Municipalities above this threshold turn orange/red (Critical Emergency).",
                  },
                ].map(({ key, label, val, color, desc }) => (
                  <div key={key} className="glass-card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{label}</span>
                      <span style={{ fontSize: 16, fontWeight: 900, color }}>{(val * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={0.9}
                      step={0.05}
                      value={val}
                      onChange={(e) => {
                        const newThresholds = { ...state.risk_thresholds, [key]: parseFloat(e.target.value) };
                        setState({ ...state, risk_thresholds: newThresholds });
                        sendAction("update_thresholds", { thresholds: newThresholds });
                      }}
                      style={{ width: "100%", accentColor: color, cursor: "pointer", marginBottom: 8 }}
                    />
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GEOSPATIAL LAYERS */}
          {activeTab === "layers" && state && (
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>
                Geospatial Map Layers Governance
              </h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>
                Control default layer visibility and spatial boundary rendering on the real satellite and dark administrative maps.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                {[
                  {
                    key: "boundaries",
                    label: "15 Municipal Boundaries",
                    desc: "Official SCB/Lantmäteriet GeoJSON vector polygons with hover tooltip",
                    icon: <Compass className="w-5 h-5 text-blue-400" />,
                  },
                  {
                    key: "simulation_risk",
                    label: "Simulation Risk Choropleth",
                    desc: "Dynamic color fill (Green/Amber/Orange/Red) representing computed vulnerability",
                    icon: <Activity className="w-5 h-5 text-red-400" />,
                  },
                  {
                    key: "weather",
                    label: "SMHI Station Nodes",
                    desc: "Stora Spånsberget A and Borlänge telemetry markers",
                    icon: <CloudSun className="w-5 h-5 text-pink-400" />,
                  },
                  {
                    key: "roads",
                    label: "Trafikverket Road Network",
                    desc: "E16, Rv50, and Rv70 transportation corridor overlay with sensor status",
                    icon: <Car className="w-5 h-5 text-amber-400" />,
                  },
                  {
                    key: "water",
                    label: "SGU Aquifer Reservoirs",
                    desc: "88 monitored groundwater basins and hydrogeological boundaries",
                    icon: <Droplets className="w-5 h-5 text-cyan-400" />,
                  },
                  {
                    key: "forest",
                    label: "Skogsstyrelsen Forest Reserves",
                    desc: "2,420 forest compartments and biodiversity monitoring tracts",
                    icon: <TreePine className="w-5 h-5 text-purple-400" />,
                  },
                ].map((item) => {
                  const isVisible = state.layers[item.key] ?? true;
                  return (
                    <div
                      key={item.key}
                      className="glass-card"
                      style={{
                        padding: 16,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", gap: 12 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "rgba(99,122,180,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={(e) => {
                            const newLayers = { ...state.layers, [item.key]: e.target.checked };
                            setState({ ...state, layers: newLayers });
                            sendAction("update_layers", { layers: newLayers });
                          }}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: ENGINE SENSITIVITY */}
          {activeTab === "sensitivity" && state && (
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>
                Spatial Engine Sensitivity Weights
              </h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>
                Calibrate multi-domain cross-hazard propagation multipliers. Higher values amplify risk propagation.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    key: "demographic",
                    label: "Demographic Pressure Sensitivity",
                    val: state.sensitivity?.demographic ?? 1,
                    desc: "Scales how heavily population growth impacts municipal water supply, food security, and housing stress.",
                  },
                  {
                    key: "climate",
                    label: "Climate Anomaly Multiplier",
                    val: state.sensitivity?.climate ?? 1,
                    desc: "Scales vulnerability amplification under extreme weather events (freezing roads, heavy rainstorms).",
                  },
                  {
                    key: "infrastructure",
                    label: "Transport Corridor Bottleneck Weight",
                    val: state.sensitivity?.infrastructure ?? 1,
                    desc: "Scales cascading impact when E16 or Rv70 experience winter icing or congestion alerts.",
                  },
                ].map(({ key, label, val, desc }) => (
                  <div key={key} className="glass-card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{label}</span>
                      <span style={{ fontSize: 16, fontWeight: 900, color: "var(--accent-blue)" }}>
                        {val.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.5}
                      step={0.1}
                      value={val}
                      onChange={(e) => {
                        const newSens = { ...state.sensitivity, [key]: parseFloat(e.target.value) };
                        setState({ ...state, sensitivity: newSens });
                        sendAction("update_sensitivity", { sensitivity: newSens });
                      }}
                      style={{ width: "100%", accentColor: "var(--accent-blue)", cursor: "pointer", marginBottom: 8 }}
                    />
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOG */}
          {activeTab === "audit" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>
                    Governance Audit Ledger
                  </h1>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Immutable historical record of all administrative actions, threshold updates, and feed toggles.
                  </p>
                </div>
                <button
                  onClick={loadAuditLog}
                  className="btn-ghost"
                  style={{ padding: "6px 12px", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Refresh Log</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {auditLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="glass-card"
                    style={{
                      padding: "12px 18px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-blue)" }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>
                          {entry.action.replace(/_/g, " ").toUpperCase()}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                          Operator: <strong>{entry.user}</strong> · Action: {entry.changes.join(", ")}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Clock className="w-3 h-3" />
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
