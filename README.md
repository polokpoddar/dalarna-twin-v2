# Region Dalarna Digital Twin v2
### Regional Intelligence & Multi-Hazard Spatial Simulation Platform
**Research & Technical Architecture Documentation**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Satellite-green?style=flat&logo=leaflet)](https://leafletjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-purple?style=flat&logo=openai)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat)](LICENSE)

---

## 📌 Executive Summary & Research Background

**Region Dalarna Digital Twin v2** is an advanced geospatial decision-support system and digital twin built for **Dalarna County, Sweden** (*Dalarnas län*). It unifies real-time public telemetry across **6 official Swedish government institutions** with a **predictive multi-hazard simulation engine** and **OpenAI GPT-4o-mini decision intelligence**.

The platform is designed for regional resilience researchers, emergency planners (*Länsstyrelsen Dalarna*), municipal authorities across all 15 municipalities, and civil protection agencies (*MSB - Myndigheten för samhällsskydd och beredskap*).

### Key Research Objectives
1. **Multi-Sector Dynamic Baseline Tracking**: Ingest and synchronize demographic, meteorological, road condition, forest canopy, cadastral, and hydrogeological data.
2. **Coupled Multi-Hazard Simulation**: Model non-linear ripple effects across interrelated sectors (e.g., how an increase in road surface temperature coupled with timber harvest affects groundwater stress and infrastructure degradation).
3. **High-Fidelity GIS Choropleth Mapping**: Render vector boundaries and centroid coordinates for all 15 Dalarna municipalities over satellite imagery with real-time risk heat-shading.
4. **AI-Driven Actionable Recommendations**: Synthesize quantitative simulation matrices into prioritized civil protection advisories via OpenAI GPT-4o-mini.

---

## 🧭 Repository Structure & File-by-File Code Map

Below is the complete architectural map detailing what each file does, its responsibilities, inputs, and outputs.

```
d:\Sinky
├── app/                                # Next.js App Router root
│   ├── layout.tsx                      # Root HTML layout, metadata, font imports, hydration flags
│   ├── page.tsx                        # Main Digital Twin dashboard (Split viewport: Map + Sidebar)
│   ├── globals.css                     # Design system, CSS variables, glassmorphism, Leaflet styles
│   ├── admin/                          # Senior Administrative Governance Console
│   │   └── page.tsx                    # Governance console: source toggles, thresholds, audit log
│   └── api/                            # Backend REST API routes
│       ├── live-data/
│       │   └── route.ts                # Real-time data pipeline (SMHI, Trafikverket, SCB, etc.)
│       ├── simulation/
│       │   └── run/
│       │       └── route.ts            # Mathematical simulation engine & OpenAI GPT-4o integration
│       └── control/
│           └── route.ts                # Administrative configuration & immutable audit ledger
├── components/                         # React UI components
│   ├── DalarnaMap.tsx                  # Interactive Leaflet GIS Satellite Map with GeoJSON & Centroids
│   ├── TopDataSourcesBar.tsx           # 6 horizontal official telemetry summary cards under navbar
│   ├── SimulationTab.tsx               # Combined Multi-Hazard Simulation interface with steppers
│   ├── DataSourcesTab.tsx              # Deep-dive telemetry inspection for all 6 Swedish agencies
│   ├── MunicipalitiesTab.tsx           # 15 Municipalities data grid, search, sort & vulnerability filter
│   └── HowItWorksModal.tsx             # Interactive Resilience Methodology & Pipeline modal guide
├── lib/                                # Core logic, constants & data models
│   ├── constants.ts                    # 15 Dalarna Municipalities baseline geodata & scenario catalogs
│   └── types.ts                        # TypeScript interfaces for simulations, risks, and telemetry
├── public/                             # Public static assets & vector files
│   └── data/
│       └── dalarna_municipalities.geojson # Exact GeoJSON vector polygons for all 15 municipalities
├── .env.local                          # Environment secrets (OPENAI_API_KEY) [git-ignored]
├── package.json                        # Project dependencies, scripts, and runtime engines
├── tsconfig.json                       # TypeScript compiler configuration
└── README.md                           # Research and system documentation
```

### Detailed File Responsibilities

| File Path | Role | Description & Data Flow |
| :--- | :--- | :--- |
| **`app/page.tsx`** | Main Viewport Controller | Manages global application state (`live` vs `simulation` mode), orchestrates the split layout between the GIS map and the right-hand analytical dashboard, and handles automatic 5-minute background polling for SMHI live telemetry. |
| **`components/DalarnaMap.tsx`** | GIS Satellite Map Engine | Renders Leaflet with ESRI World Imagery, CartoDB Dark, and OSM Street layers. Loads `dalarna_municipalities.geojson`, renders polygons with dynamic SVG fill colors corresponding to computed vulnerability levels, and plots permanent 15 municipal centroid pill badges. |
| **`app/api/simulation/run/route.ts`** | Mathematical Simulation Engine | Core scientific calculation module. Ingests user-configured driver variables, executes the multi-sector cross-coupling equations, disaggregates impacts to all 15 municipalities, and calls OpenAI `gpt-4o-mini` with structured JSON schema. |
| **`app/api/live-data/route.ts`** | Telemetry Ingestion API | Fetches live meteorological observations from SMHI Station 105220 (*Borlänge / Stora Spånsberget A*), calculates VViS road temperature offsets, and synthesizes SCB, Lantmäteriet, Skogsstyrelsen, and SGU baselines. |
| **`components/TopDataSourcesBar.tsx`** | Telemetry Header Bar | Displays the 6 official Swedish source status badges directly below the navigation bar with active frequency timers, live values, and operational heartbeat lights. |
| **`components/SimulationTab.tsx`** | Simulation Controller UI | Interactive panel allowing researchers to select simulation horizons (2026, 2030, 2035, 2040), adjust the 6 primary drivers via range sliders and `[-]`/`[+]` steppers, trigger combined calculations, and inspect AI-generated recommendations. |
| **`components/DataSourcesTab.tsx`** | Source Catalog View | Detailed analytical breakdown of each institutional data source, explaining baseline coverage, update cadence, and historical reliability. |
| **`components/MunicipalitiesTab.tsx`** | Territorial Comparison Grid | Comparative table of all 15 municipalities with live search, population density metrics, geographic areas, and per-municipality vulnerability drill-down. |
| **`components/HowItWorksModal.tsx`** | Research Methodology Modal | Interactive dialog presenting the system's mathematical foundations, multi-hazard causal graphs, and Swedish resilience compliance standards. |
| **`app/admin/page.tsx`** | System Governance Console | Administrative dashboard to toggle active feeds, calibrate risk thresholds (e.g., MSB Standard vs Precautionary Climate), adjust sensitivity weights, and inspect system audit logs. |
| **`lib/constants.ts`** | Ground Truth Geospatial Catalog | Defines the 15 municipalities with SCB codes, Swedish names, baseline populations, land area in $\text{km}^2$, centroid latitudes and longitudes, and pre-calibrated scenario models. |
| **`lib/types.ts`** | Type System Definitions | Strict TypeScript interfaces for `RiskLevel`, `MunicipalitySimulationResult`, `SimulationResult`, `DataSource`, and `SystemState`. |
| **`public/data/dalarna_municipalities.geojson`** | Vector Boundary Geodata | High-precision GeoJSON feature collection containing official multi-polygon vector coordinates for all 15 municipal borders in Dalarna. |

---

## 🏛️ The 6 Official Swedish Institutional Data Sources

The platform synthesizes data from 6 authoritative national and regional bodies:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     REGION DALARNA DIGITAL TWIN                          │
│                                                                          │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│   │     SCB      │  │ TRAFIKVERKET │  │ LANTMÄTERIET │  │SKOGSSTYRELSEN│ │
│   │ Demographics │  │ Road Weather │  │   Cadastre   │  │Forest Canopy │ │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│          │                 │                 │                 │         │
│          └────────────┐    │    ┌────────────┘                 │         │
│                       ▼    ▼    ▼                              ▼         │
│                   ┌──────────────────┐                   ┌─────────────┐ │
│                   │  MULTI-HAZARD    │◄──────────────────┤     SGU     │ │
│                   │SIMULATION ENGINE │                   │ Groundwater │ │
│                   └────────┬─────────┘                   └─────────────┘ │
│                            │                                   ▲         │
│                            │   ┌──────────────┐                │         │
│                            └───┤     SMHI     ├────────────────┘         │
│                                │ Meteorology  │                          │
│                                └──────────────┘                          │
└──────────────────────────────────────────────────────────────────────────┘
```

1. **SCB / Kolada (Statistics Sweden / *Statistiska centralbyrån*)**:
   - **Role**: Demographic demand & municipal population register.
   - **Baseline Dataset**: 2024 census totals (Dalarna total: **287,387 inhabitants** across 15 municipalities).
   - **Coverage**: Falun (59,837), Borlänge (51,604), Ludvika (25,600), Mora (20,500), down to rural areas like Vansbro (6,700).

2. **Trafikverket (Swedish Transport Administration)**:
   - **Role**: Critical transportation corridors and road surface safety.
   - **Baseline Dataset**: VViS (*Vägväderinformationssystem*) sensor network covering **42 monitoring stations**.
   - **Key Corridors**: European Route **E16** (*Falun–Borlänge corridor*), National Road **Rv50**, and **Rv70** (*Mora–Rättvik–Avesta*). Tracks road surface temperatures ($T_{\text{road}}$) and black-ice (*halka*) probability.

3. **Lantmäteriet (National Land Survey of Sweden)**:
   - **Role**: Cadastral parcels, spatial zoning, and territory development.
   - **Baseline Dataset**: **148,200 property parcels** over a geographic territory of **$28,194\,\text{km}^2$**. Monitors building permit velocity and land-use transition from wilderness/forestry to built infrastructure.

4. **Skogsstyrelsen (Swedish Forest Agency)**:
   - **Role**: Boreal forest canopy integrity, timber harvest, and wildfire fuel load.
   - **Baseline Dataset**: **2,420 monitored forest compartments** with a regional canopy integrity score of **72%** and an average of **58 annual felling notifications**.

5. **SGU (Geological Survey of Sweden / *Sveriges geologiska undersökning*)**:
   - **Role**: Hydrogeological vulnerability and aquifer storage capacity.
   - **Baseline Dataset**: **88 classified groundwater bodies** encompassing **$6,450\,\text{km}^2$** of active monitoring. Measures water table drawdown and drought risk.

6. **SMHI (Swedish Meteorological and Hydrological Institute)**:
   - **Role**: Real-time atmospheric observations and extreme climate indicators.
   - **Live Feed**: Automated telemetry from **Station 105220 (*Borlänge / Stora Spånsberget A*)** at $60.48^\circ\text{N}, 15.43^\circ\text{E}$. Tracks air temperature ($T_{\text{air}}$), precipitation rate ($\text{mm/h}$), wind speed ($\text{m/s}$), and relative humidity.

---

## 🧮 Mathematical Modeling, Equations & Scientific Calculations

The digital twin's predictive capability is driven by deterministic mathematical formulations that model cross-sectoral vulnerability propagation. All calculations are executed in `app/api/simulation/run/route.ts`.

### 1. Composite Regional Vulnerability (CRV) Score

The macro-level regional vulnerability score $\mathcal{V}_{\text{regional}} \in [0, 1]$ represents the cumulative systemic risk across Dalarna:

$$\mathcal{V}_{\text{regional}} = \text{clamp}_{[0.15, 0.95]} \left( \beta_0 + \sum_{i=1}^{6} w_i \cdot \Delta_i \right)$$

Where:
- $\beta_0 = 0.32$ (Calibrated empirical baseline vulnerability of Dalarna County under current climatic and infrastructure conditions).
- $\Delta_i$ represents the normalized perturbation vector from user input drivers:

| Driver Variable | Symbol | Normalization Term | Weight ($w_i$) | Physical Meaning |
| :--- | :---: | :---: | :---: | :--- |
| **Population Growth** | $\Delta_{\text{pop}}$ | $\frac{\Delta \text{Pop}_{\%}}{100}$ | $w_1 = 0.22$ | Municipal service and food distribution stress |
| **Road Temperature Change** | $\Delta_{\text{road}}$ | $\frac{\Delta T_{\text{road}}}{10}$ | $w_2 = 0.15$ | Freeze-thaw pavement fatigue & black ice risk |
| **Land Development Change** | $\Delta_{\text{land}}$ | $\frac{\Delta \text{Land}_{\%}}{100}$ | $w_3 = 0.18$ | Impervious surface runoff & habitat fragmentation |
| **Forest Harvest Intensity** | $\Delta_{\text{forest}}$ | $\frac{\Delta \text{Forest}_{\%}}{100}$ | $w_4 = 0.20$ | Boreal canopy depletion & loss of microclimate buffering |
| **Water Stress Change** | $\Delta_{\text{water}}$ | $\frac{|\Delta \text{Water}_{\%}|}{100}$ | $w_5 = 0.18$ | Groundwater aquifer depletion / water table crisis |
| **Atmospheric Temp Change** | $\Delta_{\text{weather}}$ | $\frac{\Delta T_{\text{weather}}}{10}$ | $w_6 = 0.16$ | Accelerated snowmelt, cloudburst, or heatwave hazard |

**Code Reference (`app/api/simulation/run/route.ts` lines 46–58):**
```typescript
compositeScore = Math.min(
  0.95,
  Math.max(
    0.15,
    0.32 +
      (popPct / 100) * 0.22 +
      (roadInc / 10) * 0.15 +
      (landPct / 100) * 0.18 +
      (forestPct / 100) * 0.20 +
      (Math.abs(waterPct) / 100) * 0.18 +
      (weatherTemp / 10) * 0.16
  )
);
```

---

### 2. Multi-Sector Cross-Coupling Multipliers

Perturbations in one sector dynamically propagate into adjacent sectors:

1. **Infrastructure Strain Multiplier ($M_{\text{infra}}$)**:
   Models how road thermal oscillation coupled with land development accelerates structural fatigue on highway bridges and transit arteries:
   $$M_{\text{infra}} = 0.35 \cdot \left(\frac{\Delta T_{\text{road}}}{10}\right) + 0.25 \cdot \left(\frac{\Delta \text{Land}_{\%}}{100}\right)$$

2. **Environmental Degradation Multiplier ($M_{\text{env}}$)**:
   Models how simultaneous clear-cutting and groundwater depletion accelerate ecological collapse:
   $$M_{\text{env}} = 0.35 \cdot \left(\frac{\Delta \text{Forest}_{\%}}{100}\right) + 0.30 \cdot \left(\frac{|\Delta \text{Water}_{\%}|}{100}\right)$$

3. **Weather Hazard Multiplier ($M_{\text{weather}}$)**:
   Models temperature-induced cloudburst and flash snowmelt risks:
   $$M_{\text{weather}} = 0.40 \cdot \left(\frac{\Delta T_{\text{weather}}}{10}\right)$$

---

### 3. Spatial Disaggregation to the 15 Municipalities

Dalarna County is not homogeneous; the urbanized south (Borlänge, Falun) experiences different pressure vectors than the expansive, mountainous, heavily forested north (Älvdalen, Mora, Orsa).

#### A. Demographic Urban-Rural Dispersion Model
When regional population increases by $\Delta \text{Pop}_{\%}$, growth concentrates in primary economic hubs:
$$\Delta \text{Pop}_{m} = \begin{cases} 
\Delta \text{Pop}_{\%} \times 1.35 & \text{if } m \in \{\text{Borlänge}, \text{Falun}\} \\
\Delta \text{Pop}_{\%} \times 0.70 & \text{for rural municipalities}
\end{cases}$$
The simulated municipal population is then:
$$P_{m}^{\text{simulated}} = \text{round}\left( P_{m}^{\text{baseline}} \times \left(1 + \frac{\Delta \text{Pop}_{m}}{100}\right) \right)$$

#### B. Hazard Sub-Index Calculations
For each municipality $m$, 4 distinct sub-hazard scores are computed on a normalized $[0, 1]$ scale:

1. **Food & Supply Chain Risk ($R_{\text{food}}$)**:
   $$R_{\text{food}} = 0.20 + \max(0, \Delta \text{Pop}_{m} \times 0.01) + \mathbb{I}_{\text{drought}} \cdot 0.30$$

2. **Infrastructure Criticality Risk ($R_{\text{infra}}$)**:
   $$R_{\text{infra}} = 0.30 + \Omega_{\text{hub}} + M_{\text{infra}} + \mathbb{I}_{\text{freeze\_thaw}} \cdot 0.45$$
   Where $\Omega_{\text{hub}} = 0.25$ for Borlänge/Falun, and $0.10$ for rural municipalities.

3. **Snowmelt & Flood Risk ($R_{\text{snow\_flood}}$)**:
   $$R_{\text{snow\_flood}} = 0.20 + \mathbb{I}_{(\text{Latitude}_m > 61.0^\circ\text{N})} \cdot 0.20 + M_{\text{weather}} + \mathbb{I}_{\text{freeze\_thaw}} \cdot 0.35$$
   *(Northern municipalities like Älvdalen, Orsa, and Mora have higher elevation and snowpacks, increasing spring freshet flood hazard).*

4. **Environmental & Forest Vulnerability ($R_{\text{env}}$)**:
   $$R_{\text{env}} = 0.20 + \mathbb{I}_{(\text{Area}_m > 3,000\,\text{km}^2)} \cdot 0.20 + M_{\text{env}}$$
   *(Vast municipal territories like Älvdalen ($6,924\,\text{km}^2$) and Malung-Sälen ($4,085\,\text{km}^2$) bear disproportionate wildfire and clear-cut exposure).*

#### C. Overall Municipal Vulnerability Formula
The combined overall risk score for each municipality is computed as a weighted multi-criteria decision analysis (MCDA) sum:

$$R_{m}^{\text{overall}} = 0.35 \cdot R_{m,\text{infra}} + 0.25 \cdot R_{m,\text{snow\_flood}} + 0.20 \cdot R_{m,\text{food}} + 0.20 \cdot R_{m,\text{env}}$$

**Code Reference (`app/api/simulation/run/route.ts` lines 200–202):**
```typescript
const overall = calculateRiskLevel(
  foodRisk.score * 0.20 +
  infraRisk.score * 0.35 +
  snowFloodRisk.score * 0.25 +
  envRisk.score * 0.20
);
```

---

### 4. Risk Discretization & Color Coding

Every computed score $S \in [0, 1]$ is discretized into standardized Swedish civil defense risk tiers:

$$\text{Tier}(S) = \begin{cases} 
\textbf{Low} & 0.00 \le S < 0.30 \quad (\text{Hex: } \texttt{\#22c55e} \text{ - Green}) \\
\textbf{Medium} & 0.30 \le S < 0.60 \quad (\text{Hex: } \texttt{\#f59e0b} \text{ - Amber}) \\
\textbf{High} & 0.60 \le S < 0.80 \quad (\text{Hex: } \texttt{\#ef4444} \text{ - Red}) \\
\textbf{Critical} & 0.80 \le S \le 1.00 \quad (\text{Hex: } \texttt{\#7c3aed} \text{ - Purple})
\end{cases}$$

This color mapping is reflected directly on the GIS map polygons, hover cards, and analytical badges.

---

## 🤖 OpenAI GPT-4o-mini Real-Time Decision Support Engine

When a researcher clicks **"Run Combined Simulation"**, the system evaluates the mathematical matrices and sends them to OpenAI's **`gpt-4o-mini`** model for contextual policy synthesis.

### AI Prompt Construction Protocol (`app/api/simulation/run/route.ts`)
The server constructs a system prompt injecting:
- Specific baseline geographic knowledge of Dalarna County.
- Target horizon year ($2026, 2030, 2035, 2040$).
- Exact quantitative outputs from the mathematical calculations (Composite score, top 3 vulnerable municipalities, sector breakdowns).
- Enforces strict JSON output conforming to:
  ```json
  {
    "summary": "1-2 sentence high-level executive summary",
    "risk_narrative": "Detailed causal explanation of how climate, forestry, infrastructure, and population interact",
    "recommendations": [
      "Prioritized action 1 naming specific Dalarna hubs (e.g. Borlänge, Falun, E16 corridor)",
      "Action 2",
      "Action 3"
    ],
    "trend_analysis": "Alignment with Swedish civil protection (MSB) and SMHI standards",
    "alert_level": "critical | high | elevated"
  }
  ```

### Deterministic Fallback Engine
If an OpenAI API key is not configured or in case of network outages, the system automatically falls back to an internal **calibrated deterministic rules engine** (lines 427–438), guaranteeing that the platform remains 100% operational in air-gapped or offline research environments.

---

## 🗺️ Interactive GIS Map Architecture

The map is implemented in `components/DalarnaMap.tsx` using **Leaflet.js**:

1. **Satellite Tile Layer**:
   - Primary: **Esri World Imagery** (`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`).
   - Alternative Basemaps: **CartoDB Dark** and **OpenStreetMap (Street)**.
2. **GeoJSON Vector Boundaries**:
   - Loaded from `public/data/dalarna_municipalities.geojson`.
   - Polygons are styled dynamically based on each municipality's computed vulnerability level ($R_{m}^{\text{overall}}$).
   - Features interactive hover effects: border width scales to $3\text{px}$, stroke color shifts to `#38bdf8`, and a floating inspection card displays live demographic stats.
3. **Municipality Centroid Labels**:
   - All 15 municipalities have permanent HTML pill badges rendered at their geographic centroid coordinates using `L.divIcon`.
   - Configured with `zIndexOffset: 1000` to guarantee crisp visibility above raster tiles and vector overlays.
4. **Lifecycle & StrictMode Protection**:
   - Uses `isCancelled` guard flags and `map.invalidateSize()` timers on mount to ensure seamless hydration in Next.js without container height collapse.

---

## ⚙️ Senior Administrative Governance (`/admin`)

The administration console provides governance over the simulation platform:
- **Feed Toggles**: Enable/disable any of the 6 data sources independently.
- **Sampling Frequency Overrides**: Adjust polling intervals (from 15 minutes up to 24 hours).
- **Threshold Policy Calibration**: Switch between:
  - *MSB Standard* (Baseline thresholds: 0.3 / 0.6 / 0.8).
  - *Precautionary Climate* (Lowered tolerance for climate and water hazards).
  - *Urban Resilient* (Optimized for transport corridors and demographic density).
- **Audit Ledger**: Tracks administrative actions with timestamps and author signatures.

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js version **18.18+** or **20+**
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/polokpoddar/dalarna-twin-v2.git
cd dalarna-twin-v2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```
*(Note: If `OPENAI_API_KEY` is omitted, the platform uses the calibrated deterministic simulation engine).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Production Build Verification
```bash
npm run build
npm run start
```

---

## 🌐 Production Deployment (Vercel)

- **Live Production URL**: [https://dalarna-twin-v2.vercel.app](https://dalarna-twin-v2.vercel.app)
- **Vercel Project Dashboard**: [https://vercel.com/proloypoddars-projects/dalarna-twin-v2](https://vercel.com/proloypoddars-projects/dalarna-twin-v2)
- **GitHub Repository**: [https://github.com/polokpoddar/dalarna-twin-v2](https://github.com/polokpoddar/dalarna-twin-v2)

### Setting OpenAI API Key on Vercel:
1. Navigate to your project on Vercel: `Settings` → `Environment Variables`.
2. Add `OPENAI_API_KEY` with your OpenAI key.
3. Redeploy or push a new commit to trigger automatic deployment.

---

## 👥 Research & Collaboration

- **Lead Developer**: Proloy Poddar ([@polokpoddar](https://github.com/polokpoddar))
- **Research Collaborator**: Mun Chowdhury ([@munchowdhury](https://github.com/munchowdhury))
- **Territorial Scope**: Dalarna County (*Region Dalarna*), Sweden.
- **Baseline Year**: 2024–2040.
