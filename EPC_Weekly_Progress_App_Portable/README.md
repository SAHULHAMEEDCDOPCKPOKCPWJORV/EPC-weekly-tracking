# Professional EPC Weekly Project Progress Management & PowerPoint Reporting Application

Enterprise-grade, cross-platform progress monitoring, scheduling, performance visualization, and native PowerPoint (`.pptx`) report generation software built for engineering, procurement, and construction (EPC) infrastructure projects.

Inspired by industry standards (Primavera P6, Microsoft Power BI, Monday.com) and the executive reference presentation:
**"Weekly Project Report – Swelect Energy Systems Ltd"** (Dexler Energy developer, 5 MW AC / 7 MWp DC ground-mount solar park, Pallaghatta, Karnataka).

---

## 🌟 Key Capabilities & Architectural Highlights

### 1. Cross-Platform Compatibility
- **Web Browsers**: Chrome, Edge, Safari, Firefox, Opera (Full responsive desktop and tablet layouts).
- **Mobile Smartphones (Android & iOS)**: Packaged via **Capacitor** (`capacitor.config.ts`), mobile bottom navigation bar, and touch gesture support.
- **Desktop (Windows & macOS)**: Standalone Progressive Web App (PWA) with offline persistence.

### 2. Genuine Editable PowerPoint Generation (`.pptx`)
- Built with **PptxGenJS** (v3.12).
- Generates **genuine editable vector shapes, native tables, and text frames**—not bitmap screenshots.
- Matches the exact 7-page structure of the Swelect Energy reference report:
  - **Slide 1**: Project Cover (Logos, Client, Capacity, COD dates, Location, Prepared by).
  - **Slide 2**: Delivery Timeline (Overall progress gauge, days to COD, workstreams, milestones).
  - **Slide 3**: Status Details (Activity-wise status, delay days, Critical Path flags).
  - **Slide 4**: Site Progress (GPS coordinates, timestamps, captions, Next Two Weeks look-ahead).
  - **Slide 5**: Risks & Client Actions ("What We Need From You" priority escalation).
  - **Slide 6**: Weekly Achievements & Management Summary (Completed, delayed, targets).

### 3. Interactive Scheduling & Visualizations
- **Overall Progress Circular Gauge**: Dynamic color-coding (Green = on track, Amber = at risk, Red = delayed).
- **Planned vs Actual S-Curve Progression**: Interactive SVG chart with hover tooltips, baseline vs actual curves, and forecast COD trajectory.
- **Primavera P6-Style Interactive Gantt Chart**:
  - Daily, weekly, monthly, and yearly time scales.
  - Zoom in/out controls.
  - Critical path red highlighting and milestone diamonds.
  - Click-to-edit activity dates, delays, and percentages with instant synchronization.
- **Monthly Delivery Timeline Chart**: 12 workstream bars with Today vertical indicator (17 Oct).
- **Status Distribution Donut Chart**: Breakdown of Completed, In Progress, Delayed, and Not Started items.

### 4. Excel Import / Export (ExcelJS)
- Export complete WBS schedules with corporate styling, frozen headers, and color-coded status cells.
- Import standard Excel sheets (`.xlsx`) to bulk-load activities with automatic field mapping.

### 5. Configurable Weighted Progress Calculation
Overall progress is computed using a documented weighted contribution model:

$$\text{Overall Actual Progress} = \frac{\sum (\text{weightage}_i \times \text{actualProgress}_i)}{\sum \text{weightage}_i}$$

$$\text{Overall Planned Progress} = \frac{\sum (\text{weightage}_i \times \text{plannedProgress}_i)}{\sum \text{weightage}_i}$$

$$\text{Weekly Progress Achieved} = \text{Current Week Progress} - \text{Previous Week Progress}$$

### 6. Weekly Historical Snapshots & Versioning
- Separate records for every reporting week (Week 40, Week 41, Week 42, etc.).
- Never overwrites previous weekly reports when initializing a new week.
- Side-by-side week comparison view with automatic delta tracking.

### 7. User Management & Role-Based Access Control (RBAC)
- Admin, Project Manager, Team Member, and Viewer roles.
- Autosave status indicator with Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`) history stack.
- Complete JSON database backup and restoration.

---

## 🚀 Quick Start Guide

### Running on Windows
Double-click `start-app.bat` or run the following in terminal:

```powershell
# Add node to path and start server
$env:PATH = "H:\weekly progress application\tools\node;$env:PATH"
npm run build
npm run server
```

Open `http://localhost:3000` in your web browser.

### Mobile & Native Platform Build Instructions

#### Android APK Build (via Capacitor):
```bash
npm run build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
```
The output APK is generated at: `android/app/build/outputs/apk/debug/app-debug.apk`.

#### iOS Build (Xcode):
```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```
In Xcode, select your signing certificate and archive for App Store or Ad-Hoc distribution.
