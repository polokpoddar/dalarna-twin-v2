"use client";

import React, { useState } from "react";
import { SimulationResult } from "@/lib/types";
import {
  SlidersHorizontal,
  Calendar,
  RotateCcw,
  Play,
  Users,
  Car,
  Map as MapIcon,
  TreePine,
  Droplets,
  CloudSun,
  Settings,
  Layers,
  BarChart3,
  Building2,
  CheckCircle2,
  ArrowRight,
  TriangleAlert,
} from "lucide-react";
import { getRiskColor } from "@/lib/constants";

interface SimulationTabProps {
  onResult: (result: SimulationResult, insight: any) => void;
}

export default function SimulationTab({ onResult }: SimulationTabProps) {
  const [targetYear, setTargetYear] = useState<number>(2030);
  const [simulationMode, setSimulationMode] = useState<"combined" | "individual">("combined");
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simInsight, setSimInsight] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 6 parameter sliders matching screenshot defaults
  const [popGrowth, setPopGrowth] = useState<number>(10);
  const [roadTemp, setRoadTemp] = useState<number>(2.0);
  const [landDev, setLandDev] = useState<number>(15);
  const [forestHarvest, setForestHarvest] = useState<number>(20);
  const [waterStress, setWaterStress] = useState<number>(-15);
  const [weatherChange, setWeatherChange] = useState<number>(2.0);

  function resetAll() {
    setPopGrowth(10);
    setRoadTemp(2.0);
    setLandDev(15);
    setForestHarvest(20);
    setWaterStress(-15);
    setWeatherChange(2.0);
    setTargetYear(2030);
  }

  async function handleRunSimulation() {
    setSimulating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/simulation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: "combined",
          targetYear,
          driver: {
            is_combined: true,
            simulation_mode: simulationMode,
            pop_growth_pct: popGrowth,
            road_temp_inc: roadTemp,
            land_dev_pct: landDev,
            forest_harvest_pct: forestHarvest,
            water_stress_pct: waterStress,
            weather_temp_c: weatherChange,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSimResult(data.result);
        setSimInsight(data.insight);
        onResult(data.result, data.insight);
      } else {
        setErrorMsg(data.error || "Simulation failed to compute.");
      }
    } catch (err: any) {
      console.error("Simulation error:", err);
      setErrorMsg("Failed to communicate with simulation engine.");
    } finally {
      setSimulating(false);
    }
  }

  const riskColor = simResult ? getRiskColor(simResult.summary.regional_risk.level) : "#3b82f6";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Title & Description */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "rgba(59,130,246,0.2)",
              border: "1px solid rgba(59,130,246,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <h2 style={{ fontSize: 14, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
            Combined Scenario Simulation
          </h2>
        </div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
          Simulate all 6 official data sources together to analyze cumulative impacts across Dalarna.
        </p>
      </div>

      {/* Scenario Year Selector & Reset All */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(13,20,37,0.5)",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--text-secondary)" }}>
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Scenario Year</span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {[2026, 2030, 2035, 2040].map((yr) => (
              <button
                key={yr}
                onClick={() => setTargetYear(yr)}
                style={{
                  padding: "4px 11px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: targetYear === yr ? "#2563eb" : "var(--border)",
                  background: targetYear === yr ? "#2563eb" : "rgba(13,20,37,0.7)",
                  color: targetYear === yr ? "#ffffff" : "var(--text-muted)",
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={resetAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 8px",
            border: "1px solid var(--border)",
            background: "transparent",
            borderRadius: 6,
            color: "var(--text-secondary)",
            fontSize: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 6 Slider Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* 1. Population (SCB / Kolada) */}
        <div
          style={{
            background: "rgba(13,20,37,0.6)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users className="w-3 h-3 text-white" />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-primary)" }}>
                Population (SCB / Kolada)
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6 }}>
                Current: 287,387 inhab. | Stable +0.3% YoY
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 180, fontSize: 10, color: "var(--text-secondary)", fontWeight: 600 }}>
              Population growth rate
            </span>
            <input
              type="range"
              min={-20}
              max={50}
              step={1}
              value={popGrowth}
              onChange={(e) => setPopGrowth(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: "#8b5cf6" }}
            />
            <div
              style={{
                width: 48,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#ffffff",
                background: "rgba(139,92,246,0.25)",
                border: "1px solid rgba(139,92,246,0.4)",
                padding: "2px 4px",
                borderRadius: 5,
              }}
            >
              {popGrowth >= 0 ? `+${popGrowth}%` : `${popGrowth}%`}
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <button
                onClick={() => setPopGrowth((p) => Math.max(-20, p - 1))}
                style={stepperBtnStyle}
              >
                –
              </button>
              <button
                onClick={() => setPopGrowth((p) => Math.min(50, p + 1))}
                style={stepperBtnStyle}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 2. Road (Trafikverket) */}
        <div
          style={{
            background: "rgba(13,20,37,0.6)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Car className="w-3 h-3 text-white" />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-primary)" }}>
                Road (Trafikverket)
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6 }}>
                Current: 1.8 °C | 0 active alerts
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 180, fontSize: 10, color: "var(--text-secondary)", fontWeight: 600 }}>
              Road temperature increase
            </span>
            <input
              type="range"
              min={-5}
              max={8}
              step={0.5}
              value={roadTemp}
              onChange={(e) => setRoadTemp(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: "#ef4444" }}
            />
            <div
              style={{
                width: 48,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#ffffff",
                background: "rgba(239,68,68,0.25)",
                border: "1px solid rgba(239,68,68,0.4)",
                padding: "2px 4px",
                borderRadius: 5,
              }}
            >
              {roadTemp >= 0 ? `+${roadTemp.toFixed(1)}°C` : `${roadTemp.toFixed(1)}°C`}
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <button
                onClick={() => setRoadTemp((p) => Math.max(-5, Math.round((p - 0.5) * 10) / 10))}
                style={stepperBtnStyle}
              >
                –
              </button>
              <button
                onClick={() => setRoadTemp((p) => Math.min(8, Math.round((p + 0.5) * 10) / 10))}
                style={stepperBtnStyle}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 3. Land (Lantmäteriet) */}
        <div
          style={{
            background: "rgba(13,20,37,0.6)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: "#0284c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapIcon className="w-3 h-3 text-white" />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-primary)" }}>
                Land (Lantmäteriet)
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6 }}>
                Current: 148,200 parcels | 145 permits
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 180, fontSize: 10, color: "var(--text-secondary)", fontWeight: 600 }}>
              New development / land use change
            </span>
            <input
              type="range"
              min={-10}
              max={50}
              step={1}
              value={landDev}
              onChange={(e) => setLandDev(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: "#3b82f6" }}
            />
            <div
              style={{
                width: 48,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#ffffff",
                background: "rgba(59,130,246,0.25)",
                border: "1px solid rgba(59,130,246,0.4)",
                padding: "2px 4px",
                borderRadius: 5,
              }}
            >
              {landDev >= 0 ? `+${landDev}%` : `${landDev}%`}
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <button
                onClick={() => setLandDev((p) => Math.max(-10, p - 1))}
                style={stepperBtnStyle}
              >
                –
              </button>
              <button
                onClick={() => setLandDev((p) => Math.min(50, p + 1))}
                style={stepperBtnStyle}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 4. Forest (Skogsstyrelsen) */}
        <div
          style={{
            background: "rgba(13,20,37,0.6)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TreePine className="w-3 h-3 text-white" />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-primary)" }}>
                Forest (Skogsstyrelsen)
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6 }}>
                Current: 2,420 stands | 72% integrity
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 180, fontSize: 10, color: "var(--text-secondary)", fontWeight: 600 }}>
              Forest harvest / change intensity
            </span>
            <input
              type="range"
              min={-10}
              max={50}
              step={1}
              value={forestHarvest}
              onChange={(e) => setForestHarvest(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: "#10b981" }}
            />
            <div
              style={{
                width: 48,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#ffffff",
                background: "rgba(16,185,129,0.25)",
                border: "1px solid rgba(16,185,129,0.4)",
                padding: "2px 4px",
                borderRadius: 5,
              }}
            >
              {forestHarvest >= 0 ? `+${forestHarvest}%` : `${forestHarvest}%`}
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <button
                onClick={() => setForestHarvest((p) => Math.max(-10, p - 1))}
                style={stepperBtnStyle}
              >
                –
              </button>
              <button
                onClick={() => setForestHarvest((p) => Math.min(50, p + 1))}
                style={stepperBtnStyle}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 5. Water (SGU) */}
        <div
          style={{
            background: "rgba(13,20,37,0.6)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: "#06b6d4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Droplets className="w-3 h-3 text-white" />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-primary)" }}>
                Water (SGU)
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6 }}>
                Current: 88 aquifers | Normal level
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 180, fontSize: 10, color: "var(--text-secondary)", fontWeight: 600 }}>
              Groundwater / water stress change
            </span>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={waterStress}
              onChange={(e) => setWaterStress(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: "#06b6d4" }}
            />
            <div
              style={{
                width: 48,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#ffffff",
                background: "rgba(6,182,212,0.25)",
                border: "1px solid rgba(6,182,212,0.4)",
                padding: "2px 4px",
                borderRadius: 5,
              }}
            >
              {waterStress >= 0 ? `+${waterStress}%` : `${waterStress}%`}
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <button
                onClick={() => setWaterStress((p) => Math.max(-50, p - 1))}
                style={stepperBtnStyle}
              >
                –
              </button>
              <button
                onClick={() => setWaterStress((p) => Math.min(50, p + 1))}
                style={stepperBtnStyle}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 6. Weather (SMHI) */}
        <div
          style={{
            background: "rgba(13,20,37,0.6)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CloudSun className="w-3 h-3 text-white" />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-primary)" }}>
                Weather (SMHI)
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6 }}>
                Current: 2.2 °C | 0.3 mm/h | 4.5 m/s
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 180, fontSize: 10, color: "var(--text-secondary)", fontWeight: 600 }}>
              Temperature & precipitation change
            </span>
            <input
              type="range"
              min={-5}
              max={8}
              step={0.5}
              value={weatherChange}
              onChange={(e) => setWeatherChange(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: "#f59e0b" }}
            />
            <div
              style={{
                width: 48,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#ffffff",
                background: "rgba(245,158,11,0.25)",
                border: "1px solid rgba(245,158,11,0.4)",
                padding: "2px 4px",
                borderRadius: 5,
              }}
            >
              {weatherChange >= 0 ? `+${weatherChange.toFixed(1)}°C` : `${weatherChange.toFixed(1)}°C`}
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <button
                onClick={() => setWeatherChange((p) => Math.max(-5, Math.round((p - 0.5) * 10) / 10))}
                style={stepperBtnStyle}
              >
                –
              </button>
              <button
                onClick={() => setWeatherChange((p) => Math.min(8, Math.round((p + 0.5) * 10) / 10))}
                style={stepperBtnStyle}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Simulation Mode Radios & Run Combined Simulation CTA Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          background: "rgba(10,15,26,0.9)",
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid var(--border)",
        }}
      >
        {/* Left: Simulation Mode */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "var(--text-primary)" }}>
            <Settings className="w-3.5 h-3.5 text-blue-400" />
            <span>Simulation Mode</span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                cursor: "pointer",
                color: simulationMode === "combined" ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              <input
                type="radio"
                name="simMode"
                checked={simulationMode === "combined"}
                onChange={() => setSimulationMode("combined")}
                style={{ accentColor: "#2563eb", cursor: "pointer" }}
              />
              <div>
                <div style={{ fontWeight: 700 }}>Combined Impact Analysis</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)" }}>All sources simulated together (recommended)</div>
              </div>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                cursor: "pointer",
                color: simulationMode === "individual" ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              <input
                type="radio"
                name="simMode"
                checked={simulationMode === "individual"}
                onChange={() => setSimulationMode("individual")}
                style={{ accentColor: "#2563eb", cursor: "pointer" }}
              />
              <div>
                <div style={{ fontWeight: 700 }}>Individual Source Analysis</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Compare single source effects</div>
              </div>
            </label>
          </div>
        </div>

        {/* Right: CTA Button */}
        <button
          onClick={handleRunSimulation}
          disabled={simulating}
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            color: "#ffffff",
            cursor: simulating ? "not-allowed" : "pointer",
            boxShadow: "0 4px 18px rgba(37,99,235,0.45)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "all 0.2s",
            opacity: simulating ? 0.75 : 1,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${simulating ? "animate-spin" : ""}`} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 900, lineHeight: 1.2 }}>
              {simulating ? "Simulating Cumulative Model…" : "Run Combined Simulation"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", lineHeight: 1.2 }}>
              Analyze cumulative impact of all 6 data sources
            </div>
          </div>
        </button>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: "8px 12px",
            background: "rgba(239,68,68,0.15)",
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

      {/* Results Display */}
      {simResult && (
        <div
          style={{
            background: "rgba(13,20,37,0.85)",
            border: `1px solid ${riskColor}55`,
            borderRadius: 10,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: `0 4px 20px ${riskColor}15`,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>
                {targetYear} Regional Vulnerability Index:
              </span>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: riskColor,
                padding: "2px 8px",
                borderRadius: 6,
                background: `${riskColor}22`,
                border: `1px solid ${riskColor}44`,
              }}
            >
              {simResult.summary.regional_risk.level} Tier ({(simResult.summary.regional_risk.score * 100).toFixed(0)}%)
            </span>
          </div>

          <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>
            {simResult.summary.key_takeaway}
          </div>

          {/* Risk category chips */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {Object.entries(simResult.summary.category_risks).map(([cat, lvl]) => (
              <div
                key={cat}
                style={{
                  background: "rgba(8,12,20,0.6)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "6px 4px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 8, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  {cat.replace(/_risk/g, "")}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: getRiskColor(lvl as string),
                    marginTop: 2,
                  }}
                >
                  {lvl}
                </div>
              </div>
            ))}
          </div>

          {/* OpenAI AI Analysis Badge */}
          {simInsight?.generated_by?.includes("OpenAI") && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                color: "#10b981",
                fontWeight: 800,
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.35)",
                padding: "3px 8px",
                borderRadius: 5,
                width: "fit-content",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 6px #10b981",
                  display: "inline-block",
                }}
              />
              <span>OpenAI GPT-4o-mini Live Regional Resilience Analysis</span>
            </div>
          )}

          {/* Risk Narrative */}
          {simInsight?.risk_narrative && (
            <div
              style={{
                fontSize: 10,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                fontStyle: "italic",
                background: "rgba(8,12,20,0.5)",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}
            >
              {simInsight.risk_narrative}
            </div>
          )}

          {/* Top recommendations */}
          {simInsight?.recommendations && (
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 2 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Priority Resilience & Emergency Actions:
              </div>
              {simInsight.recommendations.map((rec: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 10, color: "var(--text-secondary)" }}>
                  <ArrowRight className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const stepperBtnStyle: React.CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: 4,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.06)",
  color: "var(--text-primary)",
  fontWeight: 800,
  fontSize: 12,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
