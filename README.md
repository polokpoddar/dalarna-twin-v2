# Dalarna Digital Twin v2 (Regional Intelligence Platform)

AI-powered digital twin for Dalarna County, Sweden. Real-time telemetry monitoring, multi-hazard predictive simulation, and governance across 6 official Swedish data sources.

---

## 🚀 Live Production Deployment

- **Vercel Project:** [https://vercel.com/proloypoddars-projects/dalarna-twin-v2](https://vercel.com/proloypoddars-projects/dalarna-twin-v2)
- **Live URL:** [https://dalarna-twin-v2.vercel.app](https://dalarna-twin-v2.vercel.app)

---

## 🌟 Key Features

1. **6 Official Swedish Regional Feeds:**
   - **SCB / Kolada:** Population and municipal census demographics for all 15 Dalarna municipalities.
   - **Trafikverket:** Real-time road weather telemetry (VViS network) with road temperature and black-ice alerts (E16, Rv50, Rv70).
   - **Lantmäteriet:** Cadastral boundaries, 148,200 land parcels, and municipal terrain data.
   - **Skogsstyrelsen:** 2,420 forest compartments, felling notifications, biodiversity index.
   - **SGU:** 88 groundwater bodies and aquifer hydrogeological vulnerability tracking.
   - **SMHI:** Live meteorological telemetry from Borlänge / Stora Spånsberget A (station 105220).

2. **Interactive GIS Satellite Map:**
   - Leaflet with Esri World Imagery (Satellite), CartoDB Dark, and OpenStreetMap basemaps.
   - Exact SVG/GeoJSON vector boundaries for all 15 Dalarna municipalities (`public/data/dalarna_municipalities.geojson`).
   - Dynamic choropleth color scale (Low: Green, Medium: Amber, High: Red, Critical: Purple).
   - Hover cards showing municipality demographics and risk tier.

3. **Multi-Hazard Spatial Simulation Engine:**
   - 12 pre-calibrated scenario models across demographic growth, urbanization corridor strain, winter freeze-thaw cycles, wildfire exposure, drought, storm cloudbursts, and heatwaves.
   - Interactive slider steppers for fine-tuning driver variables.
   - Spatial cross-hazard propagation generating regional risk scores, category breakdown, impact deltas, and municipal decision-support recommendations.

4. **Senior Administrative Governance Console (`/admin`):**
   - Individual feed toggles and sampling interval configuration.
   - Operational mode switcher (Live Monitoring, Stress Simulation, Emergency Advisory).
   - Risk classification threshold calibration (MSB Standard, Precautionary Climate, Urban Resilient).
   - Map geospatial layer visibility controls.
   - Immutable audit logging ledger.

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐙 Push to GitHub

To push this codebase to your GitHub account:

```bash
git init
git add .
git commit -m "feat: complete Dalarna Digital Twin v2 source code"
git branch -M main
git remote add origin https://github.com/polokpoddar/dalarna-twin-v2.git
git push -u origin main
```
*(Make sure to create the repository `dalarna-twin-v2` on your GitHub first).*
