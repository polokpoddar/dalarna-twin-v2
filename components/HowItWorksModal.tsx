"use client";

import React from "react";
import { X, Layers, Cpu, Database, Activity, ShieldCheck, CheckCircle } from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(3, 7, 18, 0.8)",
        backdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(10, 16, 28, 0.98)",
          border: "1px solid rgba(99, 122, 180, 0.35)",
          borderRadius: 14,
          maxWidth: 680,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "var(--text-primary)" }}>
                How Region Dalarna Digital Twin Works
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Multi-Hazard Spatial Simulation & Cross-Sector Telemetry Engine
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: "var(--text-secondary)",
              padding: 6,
              cursor: "pointer",
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Core Concept */}
        <div
          style={{
            background: "rgba(13,20,37,0.7)",
            padding: 14,
            borderRadius: 10,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            1. Unified Multi-Source Geodatabase
          </div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Region Dalarna encompasses 15 municipalities spanning 28,194 km². This digital twin synthesizes 6 official Swedish governmental feeds:
            <strong> SCB / Kolada</strong> (population & demographics),
            <strong> Trafikverket</strong> (real-time road weather & VVIS stations),
            <strong> Lantmäteriet</strong> (cadastral parcels & topography),
            <strong> Skogsstyrelsen</strong> (boreal forest canopy & felling registers),
            <strong> SGU</strong> (hydrogeological groundwater monitoring across 88 bodies), and
            <strong> SMHI</strong> (live automated hourly meteorological telemetry from station 105220 Stora Spånsberget A).
          </div>
        </div>

        {/* Section 2: Combined Scenario Simulation */}
        <div
          style={{
            background: "rgba(13,20,37,0.7)",
            padding: 14,
            borderRadius: 10,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            2. Combined Cross-Propagation Engine
          </div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Rather than analyzing risk factors in isolation, the <strong>Combined Simulation</strong> calculates cumulative cross-domain vulnerability. For example, a concurrent rise in road temperature with increased timber harvest and groundwater depletion multiplies asphalt fatigue and flash runoff risks along transit arteries (E16, Rv50, Rv70) and forested upland zones (Älvdalen, Malung-Sälen, Mora).
          </div>
        </div>

        {/* Section 3: Vulnerability Scale Tiers */}
        <div
          style={{
            background: "rgba(13,20,37,0.7)",
            padding: 14,
            borderRadius: 10,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
            3. Vulnerability Classification Scale
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
              <div style={{ color: "#22c55e", fontWeight: 800, fontSize: 11 }}>● Low (0% – 30%)</div>
              <div style={{ color: "var(--text-muted)", fontSize: 10, marginTop: 2 }}>Nominal operational resilience and surplus municipal capacity.</div>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 11 }}>● Medium (30% – 60%)</div>
              <div style={{ color: "var(--text-muted)", fontSize: 10, marginTop: 2 }}>Detectable stress on infrastructure corridors and regional utilities.</div>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div style={{ color: "#ef4444", fontWeight: 800, fontSize: 11 }}>● High (60% – 80%)</div>
              <div style={{ color: "var(--text-muted)", fontSize: 10, marginTop: 2 }}>Heightened vulnerability; emergency contingencies and asset reallocation required.</div>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)" }}>
              <div style={{ color: "#a78bfa", fontWeight: 800, fontSize: 11 }}>● Critical (&gt;80%)</div>
              <div style={{ color: "var(--text-muted)", fontSize: 10, marginTop: 2 }}>Critical stress; cascading disruption to essential services and transport networks.</div>
            </div>
          </div>
        </div>

        {/* Section 4: Governance & Auditing */}
        <div
          style={{
            background: "rgba(13,20,37,0.7)",
            padding: 14,
            borderRadius: 10,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            4. Senior Admin & Policy Governance
          </div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Municipal planners and emergency directors can access the <strong>Senior Admin</strong> portal to inspect system integrity, review tamper-evident SHA-256 audit logs, calibrate sensitivity multipliers, and toggle individual agency feeds.
          </div>
        </div>

        {/* Close Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: "8px 20px", fontSize: 12, fontWeight: 800 }}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
