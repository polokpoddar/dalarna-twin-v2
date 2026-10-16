import { DataSource, Municipality, ScenarioDriverParam, ScenarioModel } from "./types";

export const DATA_SOURCES: DataSource[] = [
  {
    id: "scb",
    name: "SCB / Kolada",
    fullName: "Statistics Sweden (SCB)",
    role: "Population & Demographics",
    icon: "👥",
    color: "#3b82f6",
    baselinePeriod: "2024",
    description: "Official Swedish population statistics from Statistics Sweden, covering all 15 Dalarna municipalities with annual updates.",
    updateFrequency: "Annual",
    records: 15,
    unit: "inhabitants"
  },
  {
    id: "trafikverket",
    name: "Trafikverket",
    fullName: "Swedish Transport Administration",
    role: "Road & Traffic Infrastructure",
    icon: "🚗",
    color: "#f59e0b",
    baselinePeriod: "Live",
    description: "Real-time road weather data from VViS network including surface temperature, icing alerts, and traffic volumes on E16, Rv50, Rv70.",
    updateFrequency: "15 minutes",
    records: 42,
    unit: "stations"
  },
  {
    id: "lantmateriet",
    name: "Lantmäteriet",
    fullName: "National Land Survey of Sweden",
    role: "Land & Geospatial Data",
    icon: "🗺️",
    color: "#10b981",
    baselinePeriod: "2024",
    description: "Swedish national geodata including land parcels, cadastral boundaries, building footprints and terrain models for Dalarna region.",
    updateFrequency: "Daily",
    records: 148200,
    unit: "parcels"
  },
  {
    id: "skogsstyrelsen",
    name: "Skogsstyrelsen",
    fullName: "Swedish Forest Agency",
    role: "Forest & Environment Data",
    icon: "🌲",
    color: "#6d28d9",
    baselinePeriod: "2024",
    description: "Forest management data including felling notifications, woodland coverage, biodiversity zones and conservation areas across Dalarna.",
    updateFrequency: "Daily",
    records: 2420,
    unit: "notices"
  },
  {
    id: "sgu",
    name: "SGU",
    fullName: "Geological Survey of Sweden",
    role: "Water & Geology Data",
    icon: "💧",
    color: "#0ea5e9",
    baselinePeriod: "2024",
    description: "Groundwater bodies, aquifer data, hydrogeological mapping and geological risk zones via SGU OGC API Features.",
    updateFrequency: "6 hours",
    records: 88,
    unit: "groundwater bodies"
  },
  {
    id: "smhi",
    name: "SMHI",
    fullName: "Swedish Met & Hydrology Institute",
    role: "Weather & Climate Data",
    icon: "🌤️",
    color: "#ec4899",
    baselinePeriod: "Live",
    description: "Official Swedish meteorological data including temperature, precipitation, wind, humidity from Borlänge Flygplats station and regional network.",
    updateFrequency: "15 minutes",
    records: 12,
    unit: "stations"
  }
];

export const MUNICIPALITIES: Municipality[] = [
  { code: "2080", name: "Falun", population: 59016, density: 28.4, area_km2: 2040, lat: 60.6065, lon: 15.6355 },
  { code: "2081", name: "Borlänge", population: 51399, density: 65.2, area_km2: 584, lat: 60.4858, lon: 15.4366 },
  { code: "2085", name: "Ludvika", population: 26389, density: 17.8, area_km2: 1498, lat: 60.1492, lon: 15.1871 },
  { code: "2084", name: "Avesta", population: 23105, density: 37.6, area_km2: 615, lat: 60.1445, lon: 16.1685 },
  { code: "2062", name: "Mora", population: 21928, density: 7.7, area_km2: 2828, lat: 61.0044, lon: 14.5478 },
  { code: "2029", name: "Leksand", population: 15950, density: 11.3, area_km2: 1225, lat: 60.7274, lon: 14.9993 },
  { code: "2083", name: "Hedemora", population: 15300, density: 18.4, area_km2: 830, lat: 60.2791, lon: 16.0015 },
  { code: "2082", name: "Säter", population: 11200, density: 19.5, area_km2: 574, lat: 60.3515, lon: 15.7491 },
  { code: "2031", name: "Rättvik", population: 11000, density: 5.7, area_km2: 1934, lat: 60.89, lon: 15.1162 },
  { code: "2061", name: "Smedjebacken", population: 10900, density: 11.5, area_km2: 954, lat: 60.1385, lon: 15.4102 },
  { code: "2026", name: "Gagnef", population: 10400, density: 13.5, area_km2: 769, lat: 60.589, lon: 14.9487 },
  { code: "2023", name: "Malung-Sälen", population: 10200, density: 2.5, area_km2: 4106, lat: 60.6833, lon: 13.7167 },
  { code: "2039", name: "Älvdalen", population: 7000, density: 1.0, area_km2: 6878, lat: 61.2279, lon: 14.0383 },
  { code: "2034", name: "Orsa", population: 6900, density: 3.9, area_km2: 1743, lat: 61.1196, lon: 14.6167 },
  { code: "2021", name: "Vansbro", population: 6700, density: 4.4, area_km2: 1540, lat: 60.51, lon: 14.225 }
];

export const SCENARIO_MODELS: ScenarioModel[] = [
  {
    id: "population_growth",
    name: "📈 Population Growth +10%",
    source: "scb",
    description: "Moderate population growth of 10% across Dalarna by 2030, driven by urban migration to Borlänge and Falun."
  },
  {
    id: "rapid_urbanization",
    name: "🏙️ Rapid Urbanization +18%",
    source: "scb",
    description: "Accelerated urbanization of 18% concentrated in high-density corridors, straining municipal services."
  },
  {
    id: "climate_freeze_thaw",
    name: "❄️ Winter Freeze-Thaw Cycle",
    source: "trafikverket",
    description: "Severe winter scenario with -3.5°C road temperature delta and 14 freeze-thaw cycles, maximizing icing risk on E16."
  },
  {
    id: "traffic_surge",
    name: "🚛 Traffic Demand Surge +25%",
    source: "trafikverket",
    description: "25% increase in road traffic demand due to industrial expansion, increasing infrastructure stress."
  },
  {
    id: "land_development_expansion",
    name: "🏗️ Land Development +20%",
    source: "lantmateriet",
    description: "Accelerated parcel subdivision and land development pressure, intensifying municipal infrastructure loads by 20%."
  },
  {
    id: "urban_sprawl",
    name: "🌆 Urban Sprawl +15%",
    source: "lantmateriet",
    description: "Outward growth of urban footprint by 15%, increasing demand on peripheral infrastructure and green space."
  },
  {
    id: "forest_harvest_stress",
    name: "🪓 Forest Harvest Stress +25%",
    source: "skogsstyrelsen",
    description: "Intensive forestry operations increasing felling by 25%, reducing biodiversity buffer and watershed protection."
  },
  {
    id: "forest_fire_risk",
    name: "🔥 Forest Fire Risk Scenario",
    source: "skogsstyrelsen",
    description: "Extreme dry conditions elevating wildfire risk across Dalarna's boreal forests, threatening 15% canopy loss."
  },
  {
    id: "groundwater_drought",
    name: "🏜️ Groundwater Drought -30%",
    source: "sgu",
    description: "Severe groundwater depletion of 30%, endangering drinking water supply for low-lying aquifer-dependent communities."
  },
  {
    id: "aquifer_stress",
    name: "💦 Aquifer Stress +35%",
    source: "sgu",
    description: "Compound aquifer stress from industrial extraction and dry seasons, threatening 88 groundwater bodies."
  },
  {
    id: "extreme_weather_storm",
    name: "⛈️ Extreme Storm +45mm/h",
    source: "smhi",
    description: "Torrential storm with 45mm/h precipitation triggering flash-flood risks in Dalarna river valleys."
  },
  {
    id: "heat_wave",
    name: "🌡️ Heat Wave +3.2°C Anomaly",
    source: "smhi",
    description: "Prolonged heat anomaly of +3.2°C accelerating glacial melt and river flow changes across Dalarna highlands."
  }
];

export const SCENARIO_PARAMS: Record<string, ScenarioDriverParam[]> = {
  population_growth: [
    {
      key: "population_change",
      label: "Population Growth Rate",
      min: -0.2,
      max: 0.5,
      step: 0.01,
      default: 0.1,
      unit: "%",
      description: "Regional demographic growth applied across Dalarna municipalities"
    }
  ],
  rapid_urbanization: [
    {
      key: "population_change",
      label: "Urban Corridor Growth",
      min: 0.05,
      max: 0.4,
      step: 0.01,
      default: 0.18,
      unit: "%",
      description: "Accelerated concentration in Falun, Borlänge, and core transit hubs"
    }
  ],
  climate_freeze_thaw: [
    {
      key: "road_temp_delta",
      label: "Road Surface Temp Delta",
      min: -10,
      max: 2,
      step: 0.5,
      default: -3.5,
      unit: "°C",
      description: "Deviation in road surface temperature relative to ambient"
    },
    {
      key: "freeze_cycles",
      label: "Freeze-Thaw Cycles",
      min: 0,
      max: 35,
      step: 1,
      default: 14,
      unit: "cycles",
      description: "Transition cycles causing asphalt degradation and icing"
    },
    {
      key: "traffic_congestion_pct",
      label: "Highway Congestion Surge",
      min: 0,
      max: 0.6,
      step: 0.05,
      default: 0.25,
      unit: "%",
      description: "Corridor traffic slowdown on E16, Rv50, and Rv70 arterial roads"
    }
  ],
  traffic_surge: [
    {
      key: "traffic_congestion_pct",
      label: "Traffic Volume Surge",
      min: 0,
      max: 0.7,
      step: 0.05,
      default: 0.25,
      unit: "%",
      description: "Heavy logistics and commuter traffic growth on regional highway corridors"
    }
  ],
  forest_harvest_stress: [
    {
      key: "forest_felling_change",
      label: "Forest Felling Expansion",
      min: 0,
      max: 0.6,
      step: 0.05,
      default: 0.25,
      unit: "%",
      description: "Commercial timber clear-cutting increase relative to 2024 baseline"
    },
    {
      key: "biodiversity_loss_pct",
      label: "Ecosystem Buffer Loss",
      min: 0,
      max: 0.5,
      step: 0.05,
      default: 0.15,
      unit: "%",
      description: "Canopy integrity loss in key boreal wildlife conservation zones"
    }
  ],
  forest_fire_risk: [
    {
      key: "forest_felling_change",
      label: "Drought Forest Exposure",
      min: 0,
      max: 0.5,
      step: 0.05,
      default: 0.2,
      unit: "%",
      description: "Dry canopy exposed to acute wildfire ignition conditions"
    },
    {
      key: "biodiversity_loss_pct",
      label: "Habitat Loss Severity",
      min: 0,
      max: 0.5,
      step: 0.05,
      default: 0.25,
      unit: "%",
      description: "Projected loss of protected natural forest habitats"
    }
  ],
  land_development_expansion: [
    {
      key: "land_development_change",
      label: "Parcel Subdivision Rate",
      min: 0,
      max: 0.5,
      step: 0.05,
      default: 0.2,
      unit: "%",
      description: "New cadastral parcel registrations and commercial zoning"
    },
    {
      key: "zoning_pressure",
      label: "Municipal Utility Strain",
      min: 0,
      max: 0.4,
      step: 0.05,
      default: 0.15,
      unit: "%",
      description: "Infrastructure load on roads, water supply, and municipal power"
    }
  ],
  urban_sprawl: [
    {
      key: "land_development_change",
      label: "Urban Boundary Sprawl",
      min: 0,
      max: 0.4,
      step: 0.05,
      default: 0.15,
      unit: "%",
      description: "Expansion into peripheral agricultural and forested greenfield lands"
    },
    {
      key: "zoning_pressure",
      label: "Network Extension Stress",
      min: 0,
      max: 0.35,
      step: 0.05,
      default: 0.1,
      unit: "%",
      description: "Municipal capital expense strain for servicing outer settlements"
    }
  ],
  groundwater_drought: [
    {
      key: "groundwater_depletion_pct",
      label: "Groundwater Table Drop",
      min: 0,
      max: 0.7,
      step: 0.05,
      default: 0.3,
      unit: "%",
      description: "Deficit in monitored SGU aquifer wells relative to long-term median"
    },
    {
      key: "aquifer_stress",
      label: "Drinking Water Stress Index",
      min: 0,
      max: 0.7,
      step: 0.05,
      default: 0.35,
      unit: "%",
      description: "Risk to municipal water reservoirs and private household wells"
    }
  ],
  aquifer_stress: [
    {
      key: "groundwater_depletion_pct",
      label: "Extraction Volume Surge",
      min: 0,
      max: 0.6,
      step: 0.05,
      default: 0.2,
      unit: "%",
      description: "Industrial and municipal water withdrawal volume increase"
    },
    {
      key: "aquifer_stress",
      label: "Aquifer Capacity Pressure",
      min: 0,
      max: 0.7,
      step: 0.05,
      default: 0.35,
      unit: "%",
      description: "Hydrogeological stress across 88 monitored regional water bodies"
    }
  ],
  extreme_weather_storm: [
    {
      key: "precipitation_delta_mm",
      label: "Cloudburst Precipitation",
      min: 10,
      max: 120,
      step: 5,
      default: 45,
      unit: "mm/h",
      description: "Intense torrential rainfall triggering flash runoff"
    },
    {
      key: "temp_anomaly_c",
      label: "Temperature Anomaly",
      min: -5,
      max: 8,
      step: 0.5,
      default: 3.2,
      unit: "°C",
      description: "Deviation from seasonal regional average"
    },
    {
      key: "wind_gust_ms",
      label: "Peak Wind Gusts",
      min: 15,
      max: 60,
      step: 2,
      default: 28,
      unit: "m/s",
      description: "Wind hazard to forestry stands and overhead electrical lines"
    }
  ],
  heat_wave: [
    {
      key: "temp_anomaly_c",
      label: "Sustained Heat Anomaly",
      min: 1,
      max: 8,
      step: 0.5,
      default: 3.5,
      unit: "°C",
      description: "Prolonged high temperatures above summer climate average"
    },
    {
      key: "precipitation_delta_mm",
      label: "Precipitation Deficit",
      min: -40,
      max: 0,
      step: 5,
      default: -12,
      unit: "mm/h",
      description: "Soil moisture deficit exacerbating agricultural and fire hazards"
    }
  ]
};

export const SCENARIO_GROUPS = [
  {
    source: "scb",
    name: "Demographics & Population (SCB)",
    scenarios: ["population_growth", "rapid_urbanization"]
  },
  {
    source: "trafikverket",
    name: "Road & Traffic Infrastructure (Trafikverket)",
    scenarios: ["climate_freeze_thaw", "traffic_surge"]
  },
  {
    source: "skogsstyrelsen",
    name: "Forestry & Biodiversity (Skogsstyrelsen)",
    scenarios: ["forest_harvest_stress", "forest_fire_risk"]
  },
  {
    source: "lantmateriet",
    name: "Land Use & Geospatial Planning (Lantmäteriet)",
    scenarios: ["land_development_expansion", "urban_sprawl"]
  },
  {
    source: "sgu",
    name: "Water & Hydrogeology (SGU)",
    scenarios: ["groundwater_drought", "aquifer_stress"]
  },
  {
    source: "smhi",
    name: "Meteorology & Extreme Climate (SMHI)",
    scenarios: ["extreme_weather_storm", "heat_wave"]
  }
];

export function getRiskColor(level: string): string {
  switch (level) {
    case "Low":
      return "#22c55e";
    case "Medium":
      return "#f59e0b";
    case "High":
      return "#ef4444";
    case "Critical":
      return "#7c3aed";
    default:
      return "#64748b";
  }
}
