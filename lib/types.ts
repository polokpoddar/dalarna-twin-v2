export interface DataSource {
  id: string;
  name: string;
  fullName: string;
  role: string;
  icon: string;
  color: string;
  baselinePeriod: string;
  description: string;
  updateFrequency: string;
  records: number;
  unit: string;
}

export interface Municipality {
  code: string;
  name: string;
  population: number;
  density: number;
  area_km2: number;
  lat: number;
  lon: number;
}

export interface ScenarioDriverParam {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
  description: string;
}

export interface ScenarioModel {
  id: string;
  name: string;
  source: string;
  description: string;
}

export interface RiskLevel {
  score: number;
  level: "Low" | "Medium" | "High" | "Critical";
}

export interface MunicipalitySimulationResult {
  code: string;
  name: string;
  current_population: number;
  simulated_population: number;
  population_change_pct: number;
  food_risk: RiskLevel;
  infrastructure_risk: RiskLevel;
  snow_flood_risk: RiskLevel;
  environment_risk: RiskLevel;
  overall_risk: RiskLevel;
}

export interface SimulationResult {
  scenario: string;
  target_year: number;
  run_id: string;
  summary: {
    regional_risk: RiskLevel;
    category_risks: {
      food_risk: string;
      snow_flood_risk: string;
      infrastructure_risk: string;
      environment_risk: string;
    };
    key_takeaway: string;
  };
  impact_by_source: Array<{
    id: string;
    name: string;
    role: string;
    current: string;
    simulated: string;
    change: string;
    impact: string;
    status: string;
  }>;
  municipalities: MunicipalitySimulationResult[];
  assumptions: any;
  insight: {
    summary: string;
    risk_narrative: string;
    recommendations: string[];
    trend_analysis: string;
    alert_level: string;
    generated_by: string;
  };
  admin_control?: any;
  timestamp: string;
}

export interface SystemState {
  version: number;
  mode: "live" | "simulation" | "emergency";
  scope: string;
  simulation_year: number;
  sources: Record<string, boolean>;
  source_intervals: Record<string, number>;
  layers: Record<string, boolean>;
  risk_thresholds: {
    low: number;
    medium: number;
    high: number;
  };
  sensitivity: {
    demographic: number;
    climate: number;
    infrastructure: number;
  };
  applied_at: string;
  applied_by: string;
}
