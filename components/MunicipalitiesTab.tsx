"use client";

import React, { useState } from "react";
import { MUNICIPALITIES } from "@/lib/constants";
import { MunicipalitySimulationResult } from "@/lib/types";
import { Search } from "lucide-react";

interface MunicipalitiesTabProps {
  simulationData?: MunicipalitySimulationResult[];
  year?: number;
}

export default function MunicipalitiesTab({
  simulationData,
  year = 2024,
}: MunicipalitiesTabProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"current_2024" | "simulation">(
    simulationData ? "simulation" : "current_2024"
  );

  const totalPop = MUNICIPALITIES.reduce((acc, m) => acc + m.population, 0);
  const totalArea = MUNICIPALITIES.reduce((acc, m) => acc + (m.area_km2 || 0), 0);

  const filtered = MUNICIPALITIES.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.includes(search)
  ).map((m) => {
    const sim = simulationData?.find((s) => s.code === m.code);
    const sharePct = ((m.population / totalPop) * 100).toFixed(1);
    return {
      ...m,
      sim,
      sharePct,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Search and Mode Switcher */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            className="w-3.5 h-3.5 text-slate-400"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Search municipality or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(13,20,37,0.85)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "7px 10px 7px 30px",
              fontSize: 11,
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
        </div>

        {simulationData && (
          <div style={{ display: "flex", background: "rgba(99,122,180,0.12)", borderRadius: 6, padding: 2 }}>
            <button
              onClick={() => setViewMode("current_2024")}
              style={{
                border: "none",
                borderRadius: 4,
                padding: "5px 10px",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                background: viewMode === "current_2024" ? "rgba(59,130,246,0.3)" : "transparent",
                color: viewMode === "current_2024" ? "var(--accent-blue)" : "var(--text-muted)",
                transition: "all 0.18s",
              }}
            >
              2024 Baseline
            </button>
            <button
              onClick={() => setViewMode("simulation")}
              style={{
                border: "none",
                borderRadius: 4,
                padding: "5px 10px",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                background: viewMode === "simulation" ? "rgba(139,92,246,0.3)" : "transparent",
                color: viewMode === "simulation" ? "#a78bfa" : "var(--text-muted)",
                transition: "all 0.18s",
              }}
            >
              Simulated
            </button>
          </div>
        )}
      </div>

      {/* Aggregate Indicators Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          padding: "10px 12px",
          background: "rgba(13,20,37,0.65)",
          border: "1px solid var(--border)",
          borderRadius: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            SCB 2024 Census
          </div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-primary)", marginTop: 2 }}>
            {totalPop.toLocaleString()}
          </div>
          <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Total Dalarna</div>
        </div>

        <div>
          <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Territorial Area
          </div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-primary)", marginTop: 2 }}>
            {totalArea.toLocaleString()} km²
          </div>
          <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Land Surface</div>
        </div>

        <div>
          <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            County Density
          </div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "var(--accent-blue)", marginTop: 2 }}>
            {(totalPop / totalArea).toFixed(1)} /km²
          </div>
          <div style={{ fontSize: 9, color: "var(--text-muted)" }}>15 Municipalities</div>
        </div>
      </div>

      {/* Municipalities Table */}
      <div style={{ overflowX: "auto", maxHeight: "calc(100vh - 290px)", overflowY: "auto" }}>
        <table className="dt-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Municipality</th>
              <th style={{ textAlign: "right" }}>Pop. 2024</th>
              {viewMode === "current_2024" ? (
                <>
                  <th style={{ textAlign: "right" }}>Area km²</th>
                  <th style={{ textAlign: "right" }}>Density</th>
                  <th style={{ textAlign: "right" }}>Share %</th>
                </>
              ) : (
                <>
                  <th style={{ textAlign: "right" }}>Simulated</th>
                  <th style={{ textAlign: "right" }}>Delta</th>
                  <th style={{ textAlign: "center" }}>Risk Tier</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.code}>
                <td>
                  <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: 12 }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Code: {m.code}</div>
                </td>
                <td style={{ textAlign: "right", fontWeight: 700, color: "var(--text-primary)", fontSize: 11 }}>
                  {m.population.toLocaleString()}
                </td>

                {viewMode === "current_2024" ? (
                  <>
                    <td style={{ textAlign: "right", color: "var(--text-secondary)", fontSize: 11 }}>
                      {m.area_km2?.toLocaleString()}
                    </td>
                    <td style={{ textAlign: "right", color: "var(--text-secondary)", fontSize: 11 }}>
                      {m.density}
                    </td>
                    <td style={{ textAlign: "right", color: "var(--accent-blue)", fontWeight: 700, fontSize: 11 }}>
                      {m.sharePct}%
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ textAlign: "right", fontSize: 11, fontWeight: 700 }}>
                      {m.sim?.simulated_population?.toLocaleString() ?? "—"}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: 11,
                        fontWeight: 700,
                        color: (m.sim?.population_change_pct ?? 0) >= 0 ? "var(--risk-low)" : "var(--risk-high)",
                      }}
                    >
                      {m.sim ? `${m.sim.population_change_pct >= 0 ? "+" : ""}${m.sim.population_change_pct.toFixed(1)}%` : "—"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {m.sim ? (
                        <span className={`risk-badge risk-${m.sim.overall_risk.level.toLowerCase()}`}>
                          {m.sim.overall_risk.level}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
