"use client";

import React, { useState } from "react";
import { SCENARIO_GROUPS, SCENARIO_MODELS, SCENARIO_PARAMS, getRiskColor } from "@/lib/constants";
import { SimulationResult } from "@/lib/types";
import {
  SlidersVertical,
  Calendar,
  Cpu,
  RotateCcw,
  Play,
  TriangleAlert,
  Layers,
  ArrowRight,
  BarChart3,
  Building2,
  BookOpen,
} from "lucide-react";

interface SimulationTabProps {
  onResult: (result: SimulationResult, insight: any) => void;
}

export default function SimulationTab({ onResult }: SimulationTabProps) {
  const [scenario, setScenario] = useState("population_growth");
  const [targetYear, setTargetYear] = useState(2030);
  const [driverParams, setDriverParams] = useState<Record<string, number>>({});
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simInsight, setSimInsight] = useState<any>(null);
  const [subTab, setSubTab] = useState<"impact" | "municipalities" | "methodology">("impact");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeParams = SCENARIO_PARAMS[scenario] || [];
  const activeScenarioMeta = SCENARIO_MODELS.find((s) => s.id === scenario);

  function getParamVal(p: any) {
    return driverParams[p.key] ?? p.default;
  }

  function setParamVal(key: string, val: number, meta: any) {
    const clamped = Math.min(meta.max, Math.max(meta.min, Math.round(val * 100) / 100));
    setDriverParams((prev) => ({ ...prev, [key]: clamped }));
  }

  function stepParam(param: any, dir: "up" | "down") {
    const current = getParamVal(param);
    const delta = dir === "up" ? param.step : -param.step;
    setParamVal(param.key, current + delta, param);
  }

  async function runSimulation() {
    setSimulating(true);
    setErrorMsg(null);

    try {
      const driverObj: Record<string, number> = {};
      activeParams.forEach((p) => {
        driverObj[p.key] = getParamVal(p);
      });

      const res = await fetch("/api/simulation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          targetYear,
          driver: driverObj,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSimResult(data.result);
        setSimInsight(data.insight);
        onResult(data.result, data.insight);
        setSubTab("impact");
      } else {
        setErrorMsg(data.error || "Simulation run encountered an error.");
      }
    } catch (err) {
      console.error("Simulation error:", err);
      setErrorMsg("Failed to communicate with simulation engine.");
    } finally {
      setSimulating(false);
    }
  }

  const riskColor = simResult ? getRiskColor(simResult.summary.regional_risk.level) : "var(--text-muted)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Scenario Model Selector */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <SlidersVertical className="w-3.5 h-3.5 text-blue-400" />
            <span>Scenario Model</span>
          </span>
          <span style={{ fontSize: 10, color: "var(--accent-blue)", fontWeight: 700 }}>
            6 Official Catalogs
          </span>
        </div>

        <select
          value={scenario}
          onChange={(e) => {
            setScenario(e.target.value);
            setDriverParams({});
            setSimResult(null);
            setErrorMsg(null);
          }}
          style={{
            width: "100%",
            background: "rgba(13,20,37,0.95)",
            border: "1px solid var(--border-bright)",
            borderRadius: 8,
            padding: "9px 12px",
            color: "var(--text-primary)",
            fontSize: 12,
            fontWeight: 600,
            outline: "none",
            cursor: "pointer",
          }}
        >
          {SCENARIO_GROUPS.map((group) => (
            <optgroup key={group.source} label={group.name}>
              {group.scenarios.map((sId) => {
                const sModel = SCENARIO_MODELS.find((m) => m.id === sId);
                return sModel ? (
                  <option key={sModel.id} value={sModel.id}>
                    {sModel.name.replace(/^[^\w\s]+\s*/, "")}
                  </option>
                ) : null;
              })}
            </optgroup>
          ))}
        </select>

        {activeScenarioMeta && (
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.4 }}>
            {activeScenarioMeta.description}
          </div>
        )}
      </div>

      {/* Target Horizon Year */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Horizon Projection Year</span>
          </span>
          <span style={{ fontSize: 12, fontWeight: 900, color: "var(--accent-blue)" }}>
            {targetYear}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {[2026, 2030, 2035, 2040].map((yr) => (
            <button
              key={yr}
              onClick={() => setTargetYear(yr)}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 6,
                border: "1px solid",
                borderColor: targetYear === yr ? "var(--accent-blue)" : "var(--border)",
                background: targetYear === yr ? "rgba(59,130,246,0.25)" : "rgba(13,20,37,0.6)",
                color: targetYear === yr ? "var(--accent-blue)" : "var(--text-muted)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Calibrated Scenario Parameters */}
      <div
        style={{
          background: "rgba(13,20,37,0.75)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "12px 14px",
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
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Calibrated Scenario Parameters</span>
          </div>
          <button
            onClick={() => setDriverParams({})}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {activeParams.map((p) => {
            const val = getParamVal(p);
            const displayStr =
              p.unit === "%" ? `${(val * 100).toFixed(0)}%` : `${val.toFixed(1)} ${p.unit}`;

            return (
              <div key={p.key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: val !== p.default ? "var(--accent-blue)" : "var(--text-primary)",
                      background: "rgba(99,122,180,0.15)",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    {displayStr}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => stepParam(p, "down")}
                    title="Decrease parameter"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--text-primary)",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    –
                  </button>
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={val}
                    onChange={(e) => setParamVal(p.key, parseFloat(e.target.value), p)}
                    style={{ flex: 1, accentColor: "var(--accent-blue)", cursor: "pointer" }}
                  />
                  <button
                    onClick={() => stepParam(p, "up")}
                    title="Increase parameter"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--text-primary)",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.3 }}>
                  {p.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Run Button */}
      <button
        className="btn-primary"
        onClick={runSimulation}
        disabled={simulating}
        style={{
          width: "100%",
          padding: "11px 0",
          fontSize: 12,
          fontWeight: 800,
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
          boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
          cursor: simulating ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderRadius: 8,
        }}
      >
        <Play className={`w-4 h-4 fill-current ${simulating ? "animate-spin" : ""}`} />
        <span>{simulating ? "Simulating Multi-Hazard Cross-Propagation…" : "Run Spatial Simulation"}</span>
      </button>

      {errorMsg && (
        <div
          style={{
            padding: "10px 12px",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            color: "#f87171",
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <TriangleAlert className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Simulation Results Output */}
      {simResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
          {/* Composite Score Card */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: `linear-gradient(135deg, ${riskColor}22, ${riskColor}08)`,
              border: `1px solid ${riskColor}55`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--text-muted)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Composite Regional Vulnerability
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: riskColor, marginTop: 2 }}>
                  {simResult.summary.regional_risk.level} Vulnerability Tier
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: riskColor }}>
                  {(simResult.summary.regional_risk.score * 100).toFixed(0)}%
                </div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700 }}>
                  Weighted Index
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              {simResult.summary.key_takeaway}
            </div>
          </div>

          {/* Decision Support Insight */}
          {simInsight && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(139, 92, 246, 0.08)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#a78bfa",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Regional Decision Support Analysis</span>
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    padding: "1px 6px",
                    borderRadius: 4,
                    background:
                      simInsight.alert_level === "critical"
                        ? "#ef4444"
                        : simInsight.alert_level === "high"
                        ? "#f59e0b"
                        : "#3b82f6",
                    color: "#fff",
                  }}
                >
                  {simInsight.alert_level}
                </span>
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-primary)",
                  lineHeight: 1.5,
                  marginBottom: 6,
                }}
              >
                {simInsight.summary}
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  marginBottom: 8,
                  fontStyle: "italic",
                }}
              >
                {simInsight.risk_narrative}
              </div>

              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Recommended Municipal Actions:
              </div>
              {simInsight.recommendations.map((rec: string, idx: number) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    marginBottom: 3,
                    display: "flex",
                    gap: 6,
                  }}
                >
                  <ArrowRight className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}

          {/* Sub Tab Switcher */}
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "rgba(99,122,180,0.1)",
              borderRadius: 8,
              padding: 3,
            }}
          >
            {[
              { id: "impact", label: "Source Impact", icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { id: "municipalities", label: "Municipalities", icon: <Building2 className="w-3.5 h-3.5" /> },
              { id: "methodology", label: "Methodology", icon: <BookOpen className="w-3.5 h-3.5" /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setSubTab(id as any)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: "6px 4px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  background: subTab === id ? "rgba(59,130,246,0.25)" : "transparent",
                  color: subTab === id ? "var(--accent-blue)" : "var(--text-muted)",
                  transition: "all 0.18s",
                }}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Sub Tab Content: Source Impact */}
          {subTab === "impact" && (
            <div style={{ overflowX: "auto" }}>
              <table className="dt-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Domain Feed</th>
                    <th style={{ textAlign: "right" }}>Current</th>
                    <th style={{ textAlign: "right" }}>Simulated</th>
                    <th style={{ textAlign: "right" }}>Delta</th>
                    <th style={{ textAlign: "center" }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {simResult.impact_by_source.map((item) => {
                    const isNeg = item.change.startsWith("-");
                    return (
                      <tr key={item.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: 11 }}>
                            {item.name.split(" (")[0]}
                          </div>
                          <div style={{ fontSize: 9, color: "var(--text-muted)" }}>{item.role}</div>
                        </td>
                        <td style={{ textAlign: "right", fontSize: 11 }}>{item.current}</td>
                        <td style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>
                          {item.simulated}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span
                            style={{
                              color: isNeg
                                ? "var(--risk-high)"
                                : item.change === "+0%"
                                ? "var(--text-muted)"
                                : "var(--risk-low)",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            {item.change}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span
                            className={`risk-badge ${
                              item.status === "excluded"
                                ? "risk-no_data"
                                : item.impact === "Driver"
                                ? "risk-high"
                                : item.impact === "High"
                                ? "risk-medium"
                                : "risk-low"
                            }`}
                          >
                            {item.status === "excluded" ? "Disabled" : item.impact}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Sub Tab Content: Municipalities */}
          {subTab === "municipalities" && (
            <div style={{ overflowX: "auto" }}>
              <table className="dt-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Municipality</th>
                    <th style={{ textAlign: "right" }}>2024 Base</th>
                    <th style={{ textAlign: "right" }}>Sim. {simResult.target_year}</th>
                    <th style={{ textAlign: "right" }}>Delta</th>
                    <th style={{ textAlign: "center" }}>Vulnerability</th>
                  </tr>
                </thead>
                <tbody>
                  {simResult.municipalities.map((m) => (
                    <tr key={m.code}>
                      <td style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 11 }}>
                        {m.name}
                      </td>
                      <td style={{ textAlign: "right", fontSize: 11 }}>
                        {m.current_population?.toLocaleString() ?? "—"}
                      </td>
                      <td style={{ textAlign: "right", fontSize: 11, fontWeight: 700 }}>
                        {m.simulated_population?.toLocaleString() ?? "—"}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontSize: 11,
                          fontWeight: 700,
                          color: m.population_change_pct >= 0 ? "var(--risk-low)" : "var(--risk-high)",
                        }}
                      >
                        {m.population_change_pct >= 0 ? "+" : ""}
                        {m.population_change_pct.toFixed(1)}%
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`risk-badge risk-${m.overall_risk.level.toLowerCase()}`}>
                          {m.overall_risk.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sub Tab Content: Methodology */}
          {subTab === "methodology" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 11,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: 8,
                }}
              >
                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: 12, marginBottom: 4 }}>
                  Theoretical Model & Resilience Framework
                </div>
                <div>
                  This digital twin implements a multi-hazard spatial propagation engine following European
                  Environment Agency (EEA) and Swedish Civil Contingencies Agency (MSB) regional resilience
                  guidelines.
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                  Multi-Source Empirical Calibration
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div>
                    • <strong>Demographic Baseline:</strong> SCB 2024 municipal population counts (total
                    287,387 across 15 administrative units).
                  </div>
                  <div>
                    • <strong>Meteorological Telemetry:</strong> Live automated hourly observations from SMHI
                    Stora Spånsberget A (station 105220).
                  </div>
                  <div>
                    • <strong>Corridor Transport:</strong> Trafikverket VViS road temperature and friction
                    monitoring across E16, Rv50, and Rv70.
                  </div>
                  <div>
                    • <strong>Hydrogeology & Forestry:</strong> SGU 88 groundwater bodies and Skogsstyrelsen
                    boreal forest canopy monitoring.
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                  Risk Classification Thresholds
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <div
                    style={{
                      padding: "6px 8px",
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      borderRadius: 6,
                    }}
                  >
                    <strong style={{ color: "var(--risk-low)" }}>Low (&lt;30%):</strong> Nominal municipal
                    operational capacity.
                  </div>
                  <div
                    style={{
                      padding: "6px 8px",
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.25)",
                      borderRadius: 6,
                    }}
                  >
                    <strong style={{ color: "var(--risk-medium)" }}>Medium (30–60%):</strong> Noticeable
                    stress on regional infrastructure.
                  </div>
                  <div
                    style={{
                      padding: "6px 8px",
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      borderRadius: 6,
                    }}
                  >
                    <strong style={{ color: "var(--risk-high)" }}>High (60–80%):</strong> Heightened
                    vulnerability; mitigation required.
                  </div>
                  <div
                    style={{
                      padding: "6px 8px",
                      background: "rgba(124,58,237,0.1)",
                      border: "1px solid rgba(124,58,237,0.25)",
                      borderRadius: 6,
                    }}
                  >
                    <strong style={{ color: "var(--risk-critical)" }}>Critical (≥80%):</strong> Severe
                    systemic stress across multiple sectors.
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 8,
                  color: "var(--text-muted)",
                  fontSize: 10,
                }}
              >
                <span>Run ID: {simResult.run_id}</span> ·{" "}
                <span>Calibrated Period: 2024–{simResult.target_year}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
