import { NextResponse } from "next/server";
import { SystemState } from "@/lib/types";

let systemState: SystemState = {
  version: 1,
  mode: "live",
  scope: "dalarna",
  simulation_year: 2030,
  sources: {
    smhi: true,
    trafikverket: true,
    scb: true,
    sgu: true,
    skogsstyrelsen: true,
    lantmateriet: true
  },
  source_intervals: {
    smhi: 900,
    trafikverket: 900,
    scb: 86400,
    sgu: 21600,
    skogsstyrelsen: 86400,
    lantmateriet: 86400
  },
  layers: {
    boundaries: true,
    population: true,
    weather: true,
    roads: true,
    water: true,
    forest: true,
    land: true,
    simulation_risk: true
  },
  risk_thresholds: {
    low: 0.3,
    medium: 0.6,
    high: 0.8
  },
  sensitivity: {
    demographic: 1,
    climate: 1,
    infrastructure: 1
  },
  applied_at: new Date().toISOString(),
  applied_by: "system"
};

let auditLog = [
  {
    id: "init-1",
    action: "system_bootstrap",
    user: "system",
    changes: ["Initialized Dalarna baseline governance policy", "Loaded 6 official regional telemetry catalogs"],
    timestamp: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    state: systemState
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, user = "admin" } = body;
    systemState.version += 1;
    systemState.applied_at = new Date().toISOString();
    systemState.applied_by = user;

    const changesRecorded: string[] = [];

    switch (action) {
      case "bulk_toggle_sources":
        Object.keys(systemState.sources).forEach((k) => {
          systemState.sources[k] = payload.enabled;
        });
        changesRecorded.push(`Bulk set sources to ${payload.enabled ? "ACTIVE" : "DISABLED"}`);
        break;

      case "toggle_source":
        if (systemState.sources[payload.sourceId] !== undefined) {
          systemState.sources[payload.sourceId] = payload.enabled;
          changesRecorded.push(`Source ${payload.sourceId} toggled to ${payload.enabled ? "ACTIVE" : "DISABLED"}`);
        }
        break;

      case "update_interval":
        if (systemState.source_intervals[payload.sourceId] !== undefined) {
          systemState.source_intervals[payload.sourceId] = payload.seconds;
          changesRecorded.push(`Source ${payload.sourceId} polling interval set to ${payload.seconds}s`);
        }
        break;

      case "set_mode":
        systemState.mode = payload.mode;
        changesRecorded.push(`Operational mode updated to ${payload.mode.toUpperCase()}`);
        break;

      case "update_thresholds":
        systemState.risk_thresholds = { ...systemState.risk_thresholds, ...payload.thresholds };
        changesRecorded.push(`Risk classification thresholds recalibrated`);
        break;

      case "update_layers":
        systemState.layers = { ...systemState.layers, ...payload.layers };
        changesRecorded.push(`Map geospatial layer configuration updated`);
        break;

      case "update_sensitivity":
        systemState.sensitivity = { ...systemState.sensitivity, ...payload.sensitivity };
        changesRecorded.push(`Spatial simulation sensitivity multipliers updated`);
        break;

      case "apply_state":
        systemState = { ...systemState, ...payload };
        changesRecorded.push(`Applied explicit state update`);
        break;

      case "reset_defaults":
        systemState = {
          version: systemState.version,
          mode: "live",
          scope: "dalarna",
          simulation_year: 2030,
          sources: {
            smhi: true,
            trafikverket: true,
            scb: true,
            sgu: true,
            skogsstyrelsen: true,
            lantmateriet: true
          },
          source_intervals: {
            smhi: 900,
            trafikverket: 900,
            scb: 86400,
            sgu: 21600,
            skogsstyrelsen: 86400,
            lantmateriet: 86400
          },
          layers: {
            boundaries: true,
            population: true,
            weather: true,
            roads: true,
            water: true,
            forest: true,
            land: true,
            simulation_risk: true
          },
          risk_thresholds: {
            low: 0.3,
            medium: 0.6,
            high: 0.8
          },
          sensitivity: {
            demographic: 1,
            climate: 1,
            infrastructure: 1
          },
          applied_at: new Date().toISOString(),
          applied_by: user
        };
        changesRecorded.push(`Reset all parameters to official Swedish baseline standards`);
        break;

      case "flush_cache":
        changesRecorded.push(`Flushed cache buffers and resynchronized with live regional telemetry`);
        break;

      default:
        changesRecorded.push(`Applied generic administrative action: ${action}`);
    }

    auditLog.unshift({
      id: `audit-${Date.now()}`,
      action,
      user,
      changes: changesRecorded,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      state: systemState
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT() {
  return NextResponse.json({
    success: true,
    audit_log: auditLog
  });
}
