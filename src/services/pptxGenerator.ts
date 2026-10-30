import pptxgen from 'pptxgenjs';
import { Project, WeeklyReport, Activity } from '../types';

export interface PptxOptions {
  includeCover?: boolean;
  includeTimeline?: boolean;
  includeGanttChart?: boolean;
  includeStatusDetail?: boolean;
  includeSiteProgress?: boolean;
  includeNextTwoWeeks?: boolean;
  includeRisks?: boolean;
  includeSummary?: boolean;
  companyLogoUrl?: string;
  theme?: 'navy' | 'light' | 'corporate';
}

// Convert image url or data-url to base64 for PPT embedding
const getBase64Image = async (url: string): Promise<string | null> => {
  if (!url) return null;
  if (url.startsWith('data:image')) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const generateWeeklyReportPptx = async (
  project: Project,
  report: WeeklyReport,
  options: PptxOptions = {}
): Promise<void> => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 13.333" x 7.5"
  pptx.author = report.preparedBy || project.contractorName || 'Dexler Energy';
  pptx.company = project.contractorName || 'Dexler Energy';
  pptx.subject = `${project.name} - Week ${report.weekNumber} Progress Report`;
  pptx.title = `Weekly Project Report - ${project.clientName}`;

  // Enterprise Color Palette matching App & Reference PPT
  const colors = {
    navyBg: '0B1528',
    cardBg: '142343',
    white: 'FFFFFF',
    textDark: '0F172A',
    textMuted: '64748B',
    accentBlue: '0066FF',
    accentSky: '38BDF8',
    accentOrange: 'FF7A00',
    accentAmber: 'F59E0B',
    accentGreen: '10B981',
    accentRed: 'EF4444',
    borderGray: 'CBD5E1',
    headerBg: '0F2A4A',
    tableStripe: 'F8FAFC',
    barPlannedBg: 'E2E8F0',
    barProgressBlue: '1E62D0',
    barProgressGreen: '10B981',
    barProgressRed: 'EF4444',
  };

  const {
    includeCover = true,
    includeTimeline = true,
    includeGanttChart = true,
    includeStatusDetail = true,
    includeSiteProgress = true,
    includeNextTwoWeeks = true,
    includeRisks = true,
    includeSummary = true,
  } = options;

  let pageCounter = 1;

  // Strict Bounded Header (Left: 0.6", Right: 12.4", Top: 0.2" to 0.95")
  const addSlideHeader = (slide: pptxgen.Slide, title: string, pageNum: number) => {
    slide.addText(`Confidential. Prepared for ${project.clientName} by ${project.contractorName || 'Dexler Energy'}.`, {
      x: 0.6,
      y: 0.22,
      w: 7.5,
      h: 0.26,
      fontSize: 8.5,
      color: colors.textMuted,
      fontFace: 'Arial',
    });

    slide.addText(project.contractorName?.toUpperCase() || 'DEXLER ENERGY', {
      x: 8.4,
      y: 0.2,
      w: 4.0,
      h: 0.28,
      fontSize: 12,
      bold: true,
      color: colors.accentBlue,
      align: 'right',
      fontFace: 'Arial',
    });

    slide.addText(title, {
      x: 0.6,
      y: 0.50,
      w: 7.5,
      h: 0.42,
      fontSize: 17,
      bold: true,
      color: colors.textDark,
      fontFace: 'Arial',
    });

    slide.addText(`${project.clientName}  ·  Week ${report.weekNumber}  ·  ${report.reportingDate}`, {
      x: 7.2,
      y: 0.52,
      w: 5.2,
      h: 0.32,
      fontSize: 9.5,
      color: colors.textMuted,
      align: 'right',
      fontFace: 'Arial',
    });

    // Page Number strictly inside boundary
    slide.addText(`${pageNum}`, {
      x: 11.8,
      y: 6.65,
      w: 0.6,
      h: 0.25,
      fontSize: 9,
      color: colors.textMuted,
      align: 'right',
    });
  };

  // ==========================================
  // SLIDE 1: EXECUTIVE COVER PAGE (STRICT BOUNDARIES)
  // ==========================================
  if (includeCover) {
    const slide1 = pptx.addSlide();
    slide1.background = { color: 'FFFFFF' };

    slide1.addText(`Confidential. Prepared for ${project.clientName} by ${project.contractorName || 'Dexler Energy'}.`, {
      x: 0.6,
      y: 0.28,
      w: 7.5,
      h: 0.26,
      fontSize: 8.5,
      color: colors.textMuted,
      fontFace: 'Arial',
    });

    slide1.addText(project.contractorName?.toUpperCase() || 'DEXLER', {
      x: 8.4,
      y: 0.24,
      w: 4.0,
      h: 0.45,
      fontSize: 22,
      bold: true,
      color: colors.accentBlue,
      align: 'right',
      fontFace: 'Arial',
    });

    slide1.addText('DEVELOPERS OF SOLAR POWER PLANTS', {
      x: 8.4,
      y: 0.70,
      w: 4.0,
      h: 0.22,
      fontSize: 7.5,
      bold: true,
      color: colors.accentOrange,
      align: 'right',
      fontFace: 'Arial',
    });

    // Week badge
    slide1.addShape(pptx.ShapeType.rect, {
      x: 0.6,
      y: 1.25,
      w: 1.6,
      h: 0.38,
      fill: { color: colors.accentOrange },
      line: { color: colors.accentOrange },
    });
    slide1.addText(`WEEK ${report.weekNumber}`, {
      x: 0.6,
      y: 1.25,
      w: 1.6,
      h: 0.38,
      fontSize: 11.5,
      bold: true,
      color: colors.white,
      align: 'center',
      valign: 'middle',
    });

    slide1.addText('Weekly Project Report', {
      x: 0.6,
      y: 1.72,
      w: 5.6,
      h: 0.65,
      fontSize: 26,
      bold: true,
      color: colors.headerBg,
      fontFace: 'Arial',
    });

    slide1.addText(`Reporting week ending ${report.reportingEndDate || report.reportingDate}`, {
      x: 0.6,
      y: 2.45,
      w: 5.6,
      h: 0.32,
      fontSize: 11,
      bold: true,
      color: colors.accentOrange,
      fontFace: 'Arial',
    });

    // 4 Project Metadata Boxes in 2x2 grid with executive card backings
    const metaCards = [
      { label: 'CLIENT', val: project.clientName, x: 0.6, y: 2.95, w: 2.8, h: 1.10 },
      { label: 'PROJECT', val: project.name, x: 3.55, y: 2.95, w: 2.8, h: 1.10 },
      { label: 'LOCATION', val: project.location, x: 0.6, y: 4.20, w: 2.8, h: 1.10 },
      { label: 'COMMISSIONING (COD)', val: `${project.baselineCod} baseline\nForecast ${report.forecastCod || project.forecastCod}`, x: 3.55, y: 4.20, w: 2.8, h: 1.10 },
    ];

    metaCards.forEach(c => {
      slide1.addShape(pptx.ShapeType.roundRect, {
        x: c.x,
        y: c.y,
        w: c.w,
        h: c.h,
        rectRadius: 0.06,
        fill: { color: 'F8FAFC' },
        line: { color: colors.borderGray, width: 0.8 },
      });
      slide1.addText(c.label, {
        x: c.x + 0.15,
        y: c.y + 0.10,
        w: c.w - 0.3,
        h: 0.20,
        fontSize: 8,
        bold: true,
        color: colors.accentOrange,
        fontFace: 'Arial',
      });
      slide1.addText(c.val, {
        x: c.x + 0.15,
        y: c.y + 0.32,
        w: c.w - 0.3,
        h: 0.70,
        fontSize: 10.5,
        bold: true,
        color: colors.textDark,
        fontFace: 'Arial',
      });
    });

    slide1.addText(`Prepared by ${report.preparedBy || 'Project Delivery, Dexler Energy'}`, {
      x: 0.6,
      y: 5.8,
      w: 5.6,
      h: 0.32,
      fontSize: 10.5,
      bold: true,
      color: colors.textDark,
      fontFace: 'Arial',
    });

    // Right Side: Genuine User Uploaded Cover Photo or Blueprint Card (Bounds: x: 6.8 to 12.4, y: 1.25 to 6.35)
    let coverPhoto = report.sitePhotos?.find(p => p.isCover) || report.sitePhotos?.[0];
    let coverImageEmbedded = false;

    if (coverPhoto && !coverPhoto.url.includes('images.unsplash.com')) {
      const base64 = await getBase64Image(coverPhoto.url);
      if (base64) {
        slide1.addShape(pptx.ShapeType.roundRect, {
          x: 6.8,
          y: 1.25,
          w: 5.6,
          h: 5.1,
          rectRadius: 0.08,
          fill: { color: '0B1528' },
          line: { color: colors.borderGray, width: 1 },
        });

        slide1.addImage({
          data: base64,
          x: 6.9,
          y: 1.35,
          w: 5.4,
          h: 3.9,
          sizing: { type: 'contain', w: 5.4, h: 3.9 },
        });

        slide1.addShape(pptx.ShapeType.roundRect, {
          x: 6.85,
          y: 5.40,
          w: 5.5,
          h: 0.85,
          rectRadius: 0.04,
          fill: { color: '142343' },
        });

        slide1.addText(coverPhoto.caption || 'Project Site Ground View', {
          x: 6.95,
          y: 5.42,
          w: 5.3,
          h: 0.38,
          fontSize: 9.5,
          bold: true,
          color: colors.white,
        });

        slide1.addText(`${coverPhoto.location || project.location}  ·  ${coverPhoto.date || report.reportingDate}`, {
          x: 6.95,
          y: 5.80,
          w: 5.3,
          h: 0.32,
          fontSize: 8,
          color: colors.accentSky,
        });

        coverImageEmbedded = true;
      }
    }

    if (!coverImageEmbedded) {
      slide1.addShape(pptx.ShapeType.roundRect, {
        x: 6.8,
        y: 1.25,
        w: 5.6,
        h: 5.1,
        rectRadius: 0.08,
        fill: { color: '0F2A4A' },
        line: { color: colors.accentBlue, width: 1.5 },
      });

      slide1.addText('PROJECT SITE LOCATION & OVERVIEW', {
        x: 7.0,
        y: 1.55,
        w: 5.2,
        h: 0.28,
        fontSize: 9.5,
        bold: true,
        color: colors.accentAmber,
      });

      slide1.addText(project.name, {
        x: 7.0,
        y: 1.90,
        w: 5.2,
        h: 0.75,
        fontSize: 14,
        bold: true,
        color: colors.white,
      });

      slide1.addText(`Location: ${project.location}\nCapacity: ${project.capacity}\nClient: ${project.clientName}\nContractor: ${project.contractorName || 'Dexler Energy'}\nTarget COD: ${project.baselineCod}`, {
        x: 7.0,
        y: 2.75,
        w: 5.2,
        h: 2.0,
        fontSize: 10.5,
        color: colors.white,
        lineSpacing: 20,
      });

      slide1.addText('(Upload your actual site photograph in the "Site Progress" tab to display your verified ground picture on this cover)', {
        x: 7.0,
        y: 5.25,
        w: 5.2,
        h: 0.8,
        fontSize: 8,
        italic: true,
        color: colors.accentSky,
      });
    }

    slide1.addText(`${pageCounter++}`, {
      x: 11.8,
      y: 6.65,
      w: 0.5,
      h: 0.25,
      fontSize: 9,
      color: colors.textMuted,
      align: 'right',
    });
  }

  // ==========================================
  // SLIDE 2: DELIVERY TIMELINE & S-CURVE (STRICT BOUNDARIES)
  // ==========================================
  if (includeTimeline) {
    const slide2 = pptx.addSlide();
    slide2.background = { color: 'FFFFFF' };
    addSlideHeader(slide2, 'Delivery Timeline', pageCounter++);

    // Top 3 KPI Cards across x: [0.6, 12.4]
    // Card 1: Overall Progress
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y: 1.15,
      w: 3.6,
      h: 1.1,
      rectRadius: 0.08,
      fill: { color: 'F8FAFC' },
      line: { color: colors.borderGray, width: 1 },
    });
    slide2.addText('OVERALL PROGRESS', {
      x: 0.75,
      y: 1.20,
      w: 3.3,
      h: 0.18,
      fontSize: 8.5,
      bold: true,
      color: colors.textMuted,
    });
    slide2.addText(`${report.overallActualProgress}%`, {
      x: 0.75,
      y: 1.38,
      w: 1.7,
      h: 0.45,
      fontSize: 24,
      bold: true,
      color: colors.accentBlue,
    });
    slide2.addText(`plan ${report.overallPlannedProgress}%`, {
      x: 2.3,
      y: 1.50,
      w: 1.7,
      h: 0.28,
      fontSize: 11,
      color: colors.textMuted,
    });
    slide2.addShape(pptx.ShapeType.rect, {
      x: 0.75,
      y: 1.95,
      w: 3.3,
      h: 0.09,
      fill: { color: 'E2E8F0' },
    });
    slide2.addShape(pptx.ShapeType.rect, {
      x: 0.75,
      y: 1.95,
      w: Math.max(0.1, (3.3 * report.overallActualProgress) / 100),
      h: 0.09,
      fill: { color: colors.accentBlue },
    });

    // Card 2: Days to COD
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 4.5,
      y: 1.15,
      w: 3.6,
      h: 1.1,
      rectRadius: 0.08,
      fill: { color: 'F8FAFC' },
      line: { color: colors.borderGray, width: 1 },
    });
    slide2.addText('DAYS TO COD', {
      x: 4.65,
      y: 1.20,
      w: 3.3,
      h: 0.18,
      fontSize: 8.5,
      bold: true,
      color: colors.textMuted,
    });
    slide2.addText(`${report.daysToCod}`, {
      x: 4.65,
      y: 1.38,
      w: 1.7,
      h: 0.45,
      fontSize: 24,
      bold: true,
      color: colors.accentOrange,
    });
    slide2.addText(`forecast ${report.forecastDaysToCod || 63} d`, {
      x: 6.0,
      y: 1.50,
      w: 1.9,
      h: 0.28,
      fontSize: 11,
      color: colors.textMuted,
    });

    // Card 3: Commissioning Date
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 8.4,
      y: 1.15,
      w: 4.0,
      h: 1.1,
      rectRadius: 0.08,
      fill: { color: 'F8FAFC' },
      line: { color: colors.borderGray, width: 1 },
    });
    slide2.addText('COMMISSIONING DATE', {
      x: 8.55,
      y: 1.20,
      w: 3.7,
      h: 0.18,
      fontSize: 8.5,
      bold: true,
      color: colors.textMuted,
    });
    slide2.addText(project.baselineCod, {
      x: 8.55,
      y: 1.38,
      w: 3.7,
      h: 0.38,
      fontSize: 18,
      bold: true,
      color: colors.textDark,
    });
    slide2.addText(`Forecast COD: ${report.forecastCod || project.forecastCod}`, {
      x: 8.55,
      y: 1.82,
      w: 3.7,
      h: 0.22,
      fontSize: 9.5,
      color: colors.accentRed,
      bold: true,
    });

    // Bottom Left: Workstream Timeline Gantt (x: 0.6 to 8.1, y: 2.45 to 6.35)
    const ganttBoxX = 0.6;
    const ganttBoxY = 2.45;
    const ganttBoxW = 7.5;
    const ganttLabelW = 2.2;
    const ganttPlotW = 5.3;
    const ganttPlotX = ganttBoxX + ganttLabelW;

    const tStart = new Date('2026-07-01').getTime();
    const tEnd = new Date('2027-01-31').getTime();
    const tTotal = tEnd - tStart;

    const getPptDateX = (dateStr: string) => {
      const d = new Date(dateStr).getTime();
      const pct = Math.max(0, Math.min(1, (d - tStart) / tTotal));
      return ganttPlotX + pct * ganttPlotW;
    };

    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const monthW = ganttPlotW / months.length;

    slide2.addShape(pptx.ShapeType.rect, {
      x: ganttPlotX,
      y: ganttBoxY,
      w: ganttPlotW,
      h: 0.26,
      fill: { color: '0F2A4A' },
    });

    months.forEach((m, mi) => {
      slide2.addText(m, {
        x: ganttPlotX + mi * monthW,
        y: ganttBoxY,
        w: monthW,
        h: 0.26,
        fontSize: 8,
        bold: true,
        color: colors.white,
        align: 'center',
        valign: 'middle',
      });
      slide2.addShape(pptx.ShapeType.line, {
        x: ganttPlotX + mi * monthW,
        y: ganttBoxY + 0.26,
        w: 0,
        h: 3.25,
        line: { color: 'F1F5F9', width: 0.5, dashType: 'dash' },
      });
    });

    const rawWs = Array.from(new Set(report.activities.map(a => a.workstream || 'General')));
    const displayWorkstreams = rawWs.length > 0 ? rawWs.slice(0, 8) : ['Construction', 'Procurement', 'Engineering'];

    // Vertical TODAY line
    const todayPptX = getPptDateX(report.reportingDate || '2026-10-17');
    slide2.addShape(pptx.ShapeType.line, {
      x: todayPptX,
      y: ganttBoxY,
      w: 0,
      h: 3.5,
      line: { color: colors.accentAmber, width: 1.5 },
    });

    displayWorkstreams.forEach((wsName, wi) => {
      const rowY = ganttBoxY + 0.30 + wi * 0.38;
      const acts = report.activities.filter(a => (a.workstream || 'General') === wsName);
      const avgProg = acts.length > 0 ? Math.round(acts.reduce((s, a) => s + (Number(a.currentWeekProgress) || 0), 0) / acts.length) : 0;
      const isBehind = acts.some(a => a.status === 'Delayed');
      const minStart = acts[0]?.plannedStartDate || '2026-08-01';
      const maxFinish = acts[acts.length - 1]?.plannedFinishDate || '2026-11-28';

      slide2.addText(`${wsName} (${minStart.substring(5)} – ${maxFinish.substring(5)})`, {
        x: ganttBoxX,
        y: rowY,
        w: ganttLabelW - 0.1,
        h: 0.32,
        fontSize: 7.5,
        bold: true,
        color: colors.textDark,
        valign: 'middle',
      });

      const barStartX = getPptDateX(minStart);
      const barEndX = getPptDateX(maxFinish);
      const barTotalW = Math.max(0.25, barEndX - barStartX);

      slide2.addShape(pptx.ShapeType.roundRect, {
        x: barStartX,
        y: rowY + 0.05,
        w: barTotalW,
        h: 0.20,
        rectRadius: 0.04,
        fill: { color: colors.barPlannedBg },
        line: { color: colors.borderGray, width: 0.5 },
      });

      let barFillColor = colors.barProgressBlue;
      if (avgProg === 100) barFillColor = colors.barProgressGreen;
      else if (isBehind) barFillColor = colors.barProgressRed;

      const progressW = Math.max(0.12, (barTotalW * avgProg) / 100);

      slide2.addShape(pptx.ShapeType.roundRect, {
        x: barStartX,
        y: rowY + 0.05,
        w: progressW,
        h: 0.20,
        rectRadius: 0.04,
        fill: { color: barFillColor },
      });

      slide2.addText(`${avgProg}%`, {
        x: barStartX,
        y: rowY + 0.05,
        w: Math.max(progressW, 0.38),
        h: 0.20,
        fontSize: 7,
        bold: true,
        color: colors.white,
        align: 'center',
        valign: 'middle',
      });
    });

    // Workstream Legend
    const legY = 6.05;
    slide2.addShape(pptx.ShapeType.rect, { x: 0.6, y: legY, w: 0.16, h: 0.12, fill: { color: colors.barProgressBlue } });
    slide2.addText('Progress', { x: 0.8, y: legY - 0.03, w: 1.0, h: 0.18, fontSize: 7.5, color: colors.textMuted });
    slide2.addShape(pptx.ShapeType.rect, { x: 2.0, y: legY, w: 0.16, h: 0.12, fill: { color: colors.barProgressRed } });
    slide2.addText('Behind', { x: 2.2, y: legY - 0.03, w: 1.0, h: 0.18, fontSize: 7.5, color: colors.textMuted });
    slide2.addShape(pptx.ShapeType.rect, { x: 3.4, y: legY, w: 0.16, h: 0.12, fill: { color: colors.barProgressGreen } });
    slide2.addText('Done', { x: 3.6, y: legY - 0.03, w: 1.0, h: 0.18, fontSize: 7.5, color: colors.textMuted });

    // Right Bottom Section: Milestones Box (x: 8.4 to 12.4, y: 2.45 to 6.30)
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 8.4,
      y: 2.45,
      w: 4.0,
      h: 3.85,
      rectRadius: 0.08,
      fill: { color: 'F8FAFC' },
      line: { color: colors.borderGray, width: 1 },
    });

    slide2.addText('KEY PROJECT MILESTONES', {
      x: 8.6,
      y: 2.55,
      w: 3.6,
      h: 0.25,
      fontSize: 9.5,
      bold: true,
      color: colors.headerBg,
    });

    // Build an executive list of 5-6 key milestones (User milestones + Critical Path gates + Contractual COD gates)
    const collectedMilestones: { num: string; name: string; date: string; status: string }[] = [];

    // 1. Explicit user milestones
    report.activities.filter(a => a.isMilestone).forEach(m => {
      collectedMilestones.push({
        num: String(collectedMilestones.length + 1),
        name: m.name,
        date: m.plannedFinishDate,
        status: m.status === 'Completed' ? 'Completed' : (m.isCriticalPath ? 'Critical Path' : m.status),
      });
    });

    // 2. High priority Critical Path activities if fewer than 5
    if (collectedMilestones.length < 5) {
      report.activities.filter(a => a.isCriticalPath && !a.isMilestone).forEach(cp => {
        if (collectedMilestones.length < 5 && !collectedMilestones.some(m => m.name === cp.name)) {
          collectedMilestones.push({
            num: String(collectedMilestones.length + 1),
            name: cp.name,
            date: cp.plannedFinishDate,
            status: cp.status === 'Completed' ? 'Completed' : 'Critical Path',
          });
        }
      });
    }

    // 3. Contractual COD & Handover stage gates if still fewer than 5
    const defaultStageGates = [
      { name: 'CEIG & Grid Safety Sanction', date: '04 Nov 26', status: 'Pending' },
      { name: '66kV Grid Bay Work Completion', date: '17 Nov 26', status: 'Critical Path' },
      { name: 'Grid Synchronisation Approval', date: '27 Nov 26', status: 'Pending' },
      { name: 'Commercial Operation (Target COD)', date: project.baselineCod, status: 'Target COD' },
      { name: 'Final Handover to Client (HOTO)', date: report.forecastCod || project.forecastCod, status: 'Contractual' },
    ];

    for (const gate of defaultStageGates) {
      if (collectedMilestones.length >= 6) break;
      if (!collectedMilestones.some(m => m.name.toLowerCase().includes(gate.name.toLowerCase()))) {
        collectedMilestones.push({
          num: String(collectedMilestones.length + 1),
          name: gate.name,
          date: gate.date,
          status: gate.status,
        });
      }
    }

    const dynamicMilestones = collectedMilestones.slice(0, 6);

    dynamicMilestones.forEach((m, idx) => {
      const my = 2.90 + idx * 0.52;
      slide2.addShape(pptx.ShapeType.rect, {
        x: 8.6,
        y: my + 0.04,
        w: 0.26,
        h: 0.26,
        fill: { color: colors.accentBlue },
      });
      slide2.addText(m.num, {
        x: 8.6,
        y: my + 0.04,
        w: 0.26,
        h: 0.26,
        fontSize: 8.5,
        bold: true,
        color: colors.white,
        align: 'center',
        valign: 'middle',
      });
      slide2.addText(m.name, {
        x: 8.95,
        y: my,
        w: 2.2,
        h: 0.22,
        fontSize: 8.5,
        bold: true,
        color: colors.textDark,
      });
      slide2.addText(m.date, {
        x: 8.95,
        y: my + 0.20,
        w: 1.8,
        h: 0.18,
        fontSize: 7.5,
        color: colors.textMuted,
      });
      slide2.addText(m.status, {
        x: 10.8,
        y: my + 0.06,
        w: 1.45,
        h: 0.22,
        fontSize: 8,
        bold: true,
        align: 'right',
        color: m.status === 'Critical Path' || m.status === 'Delayed' ? colors.accentRed : colors.accentBlue,
      });
    });
  }

  // ==========================================
  // SLIDE 3: WEEKLY MASTER GANTT SCHEDULE (ALL ACTIVITIES ON ONE SLIDE - ADAPTIVE SIZING)
  // ==========================================
  if (includeGanttChart) {
    const allGanttActs = report.activities;
    const N = Math.max(1, allGanttActs.length);

    let minTime = new Date('2026-08-01').getTime();
    let maxTime = new Date('2027-01-31').getTime();

    if (allGanttActs.length > 0) {
      const validStarts = allGanttActs.map(a => new Date(a.plannedStartDate).getTime()).filter(t => !isNaN(t));
      const validFinishes = allGanttActs.map(a => new Date(a.plannedFinishDate).getTime()).filter(t => !isNaN(t));
      if (validStarts.length > 0) minTime = Math.min(...validStarts);
      if (validFinishes.length > 0) maxTime = Math.max(...validFinishes);

      const codTime = new Date(project.baselineCod).getTime();
      if (!isNaN(codTime)) maxTime = Math.max(maxTime, codTime);
      const todayTime = new Date(report.reportingDate).getTime();
      if (!isNaN(todayTime)) {
        minTime = Math.min(minTime, todayTime);
        maxTime = Math.max(maxTime, todayTime);
      }
    }
    minTime -= 7 * 86400000;
    maxTime += 14 * 86400000;
    const totalSpan = Math.max(86400000 * 30, maxTime - minTime);

    // Coordinates bounded strictly inside x: [0.6, 12.4] and y: [1.05, 6.45]
    const gL = 0.6;
    const gT = 1.05;
    const gW = 11.8;
    const nameColW = 3.9;
    const timePlotW = gW - nameColW; // 7.9 inches
    const timePlotX = gL + nameColW;

    const getGanttX = (dateStr: string) => {
      const d = new Date(dateStr).getTime();
      if (isNaN(d)) return timePlotX;
      const pct = Math.max(0, Math.min(1, (d - minTime) / totalSpan));
      return timePlotX + pct * timePlotW;
    };

    const startMonth = new Date(minTime);
    startMonth.setDate(1);
    const endMonth = new Date(maxTime);
    endMonth.setDate(1);

    const monthHeaders: { label: string; x: number; w: number }[] = [];
    const curr = new Date(startMonth);
    while (curr <= endMonth) {
      const nextM = new Date(curr);
      nextM.setMonth(nextM.getMonth() + 1);
      const mStartX = getGanttX(curr.toISOString().split('T')[0]);
      const mEndX = getGanttX(nextM.toISOString().split('T')[0]);
      let mW = Math.max(0.35, mEndX - mStartX);
      const maxTimelineX = timePlotX + timePlotW;
      if (mStartX + mW > maxTimelineX) {
        mW = Math.max(0.2, maxTimelineX - mStartX);
      }
      const label = curr.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      monthHeaders.push({ label, x: mStartX, w: mW });
      curr.setMonth(curr.getMonth() + 1);
    }

    // ADAPTIVE SIZING: Fits all weekly activities inside 5.0" vertical height
    const maxUsableGanttH = 4.80;
    const rowPitch = Math.min(0.38, Math.max(0.18, maxUsableGanttH / N));
    const rowH = Math.max(0.16, rowPitch * 0.88);
    const barH = Math.max(0.10, Math.min(0.20, rowPitch * 0.52));
    const barOffsetY = Math.max(0.01, (rowPitch - barH) / 2);

    let fontSz = 8.0;
    if (N > 18) fontSz = 6.2;
    else if (N > 13) fontSz = 6.8;
    else if (N > 9) fontSz = 7.2;

    const slideGantt = pptx.addSlide();
    slideGantt.background = { color: 'FFFFFF' };
    addSlideHeader(slideGantt, 'Weekly Master Gantt Schedule (Primavera P6 Standard)', pageCounter++);

    // Activity Table Header
    slideGantt.addShape(pptx.ShapeType.rect, {
      x: gL,
      y: gT,
      w: nameColW,
      h: 0.30,
      fill: { color: '0F2A4A' },
    });
    slideGantt.addText('Activity ID / WBS & Name', {
      x: gL + 0.1,
      y: gT,
      w: 2.7,
      h: 0.30,
      fontSize: 8.5,
      bold: true,
      color: colors.white,
      valign: 'middle',
    });
    slideGantt.addText('Status', {
      x: gL + 2.8,
      y: gT,
      w: 1.0,
      h: 0.30,
      fontSize: 8.5,
      bold: true,
      align: 'center',
      color: colors.white,
      valign: 'middle',
    });

    // Timeline Headers
    slideGantt.addShape(pptx.ShapeType.rect, {
      x: timePlotX,
      y: gT,
      w: timePlotW,
      h: 0.30,
      fill: { color: '0B1528' },
    });

    const gridH = Math.min(5.1, 0.30 + N * rowPitch);

    monthHeaders.forEach(mh => {
      slideGantt.addText(mh.label, {
        x: mh.x,
        y: gT,
        w: mh.w,
        h: 0.30,
        fontSize: 8,
        bold: true,
        color: colors.white,
        align: 'center',
        valign: 'middle',
      });
      slideGantt.addShape(pptx.ShapeType.line, {
        x: mh.x,
        y: gT + 0.30,
        w: 0,
        h: gridH,
        line: { color: 'E2E8F0', width: 0.5, dashType: 'dash' },
      });
    });

    // Vertical marker: TODAY (with Primavera P6 Pill Badge)
    const todayP6X = getGanttX(report.reportingDate || '2026-10-17');
    slideGantt.addShape(pptx.ShapeType.roundRect, {
      x: Math.max(timePlotX, Math.min(timePlotX + timePlotW - 0.75, todayP6X - 0.35)),
      y: gT - 0.20,
      w: 0.70,
      h: 0.17,
      rectRadius: 0.04,
      fill: { color: colors.accentAmber },
    });
    slideGantt.addText('TODAY', {
      x: Math.max(timePlotX, Math.min(timePlotX + timePlotW - 0.75, todayP6X - 0.35)),
      y: gT - 0.20,
      w: 0.70,
      h: 0.17,
      fontSize: 7,
      bold: true,
      color: colors.white,
      align: 'center',
      valign: 'middle',
    });
    slideGantt.addShape(pptx.ShapeType.line, {
      x: todayP6X,
      y: gT,
      w: 0,
      h: gridH,
      line: { color: colors.accentAmber, width: 2 },
    });

    // Vertical marker: Baseline COD (with Pill Badge)
    const codP6X = getGanttX(project.baselineCod);
    slideGantt.addShape(pptx.ShapeType.roundRect, {
      x: Math.max(timePlotX, Math.min(timePlotX + timePlotW - 0.65, codP6X - 0.30)),
      y: gT - 0.20,
      w: 0.60,
      h: 0.17,
      rectRadius: 0.04,
      fill: { color: colors.accentSky },
    });
    slideGantt.addText('COD', {
      x: Math.max(timePlotX, Math.min(timePlotX + timePlotW - 0.65, codP6X - 0.30)),
      y: gT - 0.20,
      w: 0.60,
      h: 0.17,
      fontSize: 7,
      bold: true,
      color: colors.white,
      align: 'center',
      valign: 'middle',
    });
    slideGantt.addShape(pptx.ShapeType.line, {
      x: codP6X,
      y: gT,
      w: 0,
      h: gridH,
      line: { color: colors.accentSky, width: 1.5, dashType: 'dash' },
    });

    // Render ALL Activity Rows with Adaptive Pitch on ONE Slide
    allGanttActs.forEach((act, ai) => {
      const aY = gT + 0.32 + ai * rowPitch;

      if (ai % 2 === 1) {
        slideGantt.addShape(pptx.ShapeType.rect, {
          x: gL,
          y: aY,
          w: gW,
          h: rowH,
          fill: { color: 'F8FAFC' },
        });
      }

      const cpTag = act.isCriticalPath ? ' [CP]' : '';
      slideGantt.addText(`${act.wbsCode || act.activityId} ${act.name}${cpTag}`, {
        x: gL + 0.08,
        y: aY,
        w: 2.7,
        h: rowH,
        fontSize: fontSz,
        bold: act.isCriticalPath,
        color: act.isCriticalPath ? colors.accentRed : colors.textDark,
        valign: 'middle',
      });

      let statusBadgeColor = colors.accentBlue;
      let statusBadgeText = `${act.currentWeekProgress}%`;
      if (act.status === 'Completed' || act.currentWeekProgress === 100) {
        statusBadgeColor = colors.accentGreen;
        statusBadgeText = 'Done 100%';
      } else if (act.status === 'Delayed' || (act.delayDays && act.delayDays > 0)) {
        statusBadgeColor = colors.accentRed;
        statusBadgeText = `Delay ${act.delayDays || 0}d`;
      }

      slideGantt.addShape(pptx.ShapeType.roundRect, {
        x: gL + 2.85,
        y: aY + barOffsetY,
        w: 0.95,
        h: barH,
        rectRadius: 0.04,
        fill: { color: statusBadgeColor },
      });
      slideGantt.addText(statusBadgeText, {
        x: gL + 2.85,
        y: aY + barOffsetY,
        w: 0.95,
        h: barH,
        fontSize: Math.max(6.0, fontSz - 0.5),
        bold: true,
        color: colors.white,
        align: 'center',
        valign: 'middle',
      });

      const bX1 = getGanttX(act.plannedStartDate);
      const bX2 = getGanttX(act.plannedFinishDate);
      let bW = Math.max(0.20, bX2 - bX1);
      const maxTimelineX = timePlotX + timePlotW;
      if (bX1 + bW > maxTimelineX) {
        bW = Math.max(0.12, maxTimelineX - bX1);
      }

      slideGantt.addShape(pptx.ShapeType.roundRect, {
        x: bX1,
        y: aY + barOffsetY,
        w: bW,
        h: barH,
        rectRadius: 0.04,
        fill: { color: colors.barPlannedBg },
        line: { color: colors.borderGray, width: 0.5 },
      });

      let barFillColor = colors.accentBlue;
      if (act.status === 'Completed' || act.currentWeekProgress === 100) barFillColor = colors.accentGreen;
      else if (act.isCriticalPath || act.status === 'Delayed') barFillColor = colors.accentRed;

      const actFillW = Math.max(0.06, Math.min(bW, (bW * (act.currentWeekProgress || 0)) / 100));

      slideGantt.addShape(pptx.ShapeType.roundRect, {
        x: bX1,
        y: aY + barOffsetY,
        w: actFillW,
        h: barH,
        rectRadius: 0.04,
        fill: { color: barFillColor },
      });

      const textW = Math.min(bW, Math.max(actFillW, 0.38));
      const textX = Math.min(bX1, maxTimelineX - textW);
      slideGantt.addText(`${act.currentWeekProgress}%`, {
        x: textX,
        y: aY + barOffsetY,
        w: textW,
        h: barH,
        fontSize: Math.max(6.0, fontSz - 0.5),
        bold: true,
        color: colors.white,
        align: 'center',
        valign: 'middle',
      });

      if (act.isMilestone) {
        const diaH = Math.min(0.18, rowPitch * 0.6);
        slideGantt.addShape(pptx.ShapeType.diamond, {
          x: bX2 - 0.09,
          y: aY + (rowH - diaH) / 2,
          w: diaH,
          h: diaH,
          fill: { color: colors.accentAmber },
          line: { color: '0F172A', width: 0.5 },
        });
      }
    });

    // Dynamic Bottom Legend (Strictly contained inside slide)
    const legY = Math.min(6.35, gT + 0.34 + N * rowPitch + 0.12);
    slideGantt.addShape(pptx.ShapeType.roundRect, { x: gL, y: legY, w: 0.18, h: 0.12, rectRadius: 0.02, fill: { color: colors.accentGreen } });
    slideGantt.addText('Completed', { x: gL + 0.22, y: legY - 0.03, w: 1.0, h: 0.18, fontSize: 8, color: colors.textDark });

    slideGantt.addShape(pptx.ShapeType.roundRect, { x: gL + 1.4, y: legY, w: 0.18, h: 0.12, rectRadius: 0.02, fill: { color: colors.accentRed } });
    slideGantt.addText('Delayed / Critical Path', { x: gL + 1.62, y: legY - 0.03, w: 1.5, h: 0.18, fontSize: 8, color: colors.textDark });

    slideGantt.addShape(pptx.ShapeType.roundRect, { x: gL + 3.3, y: legY, w: 0.18, h: 0.12, rectRadius: 0.02, fill: { color: colors.accentBlue } });
    slideGantt.addText('In Progress', { x: gL + 3.52, y: legY - 0.03, w: 1.0, h: 0.18, fontSize: 8, color: colors.textDark });

    slideGantt.addShape(pptx.ShapeType.line, { x: gL + 4.8, y: legY + 0.06, w: 0.25, h: 0, line: { color: colors.accentAmber, width: 2 } });
    slideGantt.addText('Today line', { x: gL + 5.1, y: legY - 0.03, w: 1.0, h: 0.18, fontSize: 8, color: colors.textDark });

    slideGantt.addShape(pptx.ShapeType.line, { x: gL + 6.3, y: legY + 0.06, w: 0.25, h: 0, line: { color: colors.accentSky, width: 1.5, dashType: 'dash' } });
    slideGantt.addText('COD line', { x: gL + 6.6, y: legY - 0.03, w: 1.0, h: 0.18, fontSize: 8, color: colors.textDark });
  }

  // ==========================================
  // SLIDE 4: STATUS DETAILS (ALL ACTIVITIES ON ONE SLIDE - STRICT FIT & WIDE STATUS COLUMN)
  // ==========================================
  if (includeStatusDetail) {
    const allActivities = report.activities;
    const N = Math.max(1, allActivities.length);
    const totalRows = N + 1; // + 1 header
    const tableY = 1.05; // Starting high to maximize vertical clearance
    const maxTableH = 5.15; // Guarantees table finishes at <= 6.20" (Slide height is 7.50")
    const adaptiveRowH = Math.max(0.18, Math.min(0.32, maxTableH / totalRows));

    let adaptiveFontSize = 8.0;
    if (N > 18) adaptiveFontSize = 6.5;
    else if (N > 13) adaptiveFontSize = 7.0;
    else if (N > 9) adaptiveFontSize = 7.5;

    const slideStatus = pptx.addSlide();
    slideStatus.background = { color: 'FFFFFF' };
    addSlideHeader(slideStatus, `Status Detail  ·  week ending ${report.reportingEndDate || report.reportingDate}`, pageCounter++);

    const tableHeaders: any[] = [
      { text: 'WBS', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white, align: 'center' as const } },
      { text: 'Task / Activity Name', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white } },
      { text: 'Planned Finish', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white, align: 'center' as const } },
      { text: 'Status & Delay', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white, align: 'center' as const } },
      { text: 'Progress', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white, align: 'right' as const } },
    ];

    const tableData: any[] = [tableHeaders];

    allActivities.forEach(act => {
      let statusColor = colors.textDark;
      let statusText = String(act.status);
      if (act.status === 'Delayed' || (act.delayDays && act.delayDays > 0)) {
        statusColor = colors.accentRed;
        statusText = `Delayed ${act.delayDays || 0} d${act.isCriticalPath ? ' · CP' : ''}`;
      } else if (act.status === 'Completed' || act.currentWeekProgress === 100) {
        statusColor = colors.accentGreen;
        statusText = `Completed ${act.actualFinishDate || ''}`;
      } else if (act.isCriticalPath) {
        statusColor = colors.accentOrange;
        statusText = `In progress · CP`;
      } else {
        statusText = 'In progress';
        statusColor = colors.accentBlue;
      }

      tableData.push([
        { text: act.wbsCode || act.activityId, options: { align: 'center' as const, color: colors.textMuted } },
        { text: act.name, options: { bold: true, color: colors.textDark } },
        { text: act.plannedFinishDate, options: { align: 'center' as const, color: colors.textMuted } },
        { text: statusText, options: { bold: true, align: 'center' as const, color: statusColor, margin: [1, 6, 1, 6] } },
        { 
          text: `${act.currentWeekProgress}%`, 
          options: { 
            bold: true, 
            align: 'right' as const, 
            color: act.currentWeekProgress === 100 ? colors.accentGreen : colors.accentBlue 
          } 
        },
      ]);
    });

    slideStatus.addTable(tableData, {
      x: 0.6,
      y: tableY,
      w: 11.8,
      colW: [0.70, 5.20, 1.50, 3.00, 1.40],
      rowH: adaptiveRowH,
      fontSize: adaptiveFontSize,
      border: { pt: 0.5, color: colors.borderGray },
      autoPage: false,
      margin: [1, 5, 1, 5],
    });

    const totalTableH = totalRows * adaptiveRowH;
    const footerY = Math.min(6.50, tableY + totalTableH + 0.12);

    slideStatus.addText(`Total schedule: ${allActivities.length} activities tracked in single executive view`, {
      x: 0.6,
      y: footerY,
      w: 10.0,
      h: 0.22,
      fontSize: 8.0,
      italic: true,
      color: colors.textMuted,
    });
  }

  // ==========================================
  // SLIDE 5: SITE PROGRESS PHOTOGRAPHS (STRICT BOUNDARIES)
  // ==========================================
  if (includeSiteProgress) {
    const slideSite = pptx.addSlide();
    slideSite.background = { color: 'FFFFFF' };
    addSlideHeader(slideSite, 'Site Progress Photographs', pageCounter++);

    const userPhotos = (report.sitePhotos || []).filter(p => p.url && !p.url.includes('images.unsplash.com'));

    if (userPhotos.length > 0) {
      const displayPhotos = userPhotos.slice(0, 3);
      const cardW = displayPhotos.length === 1 ? 7.6 : (displayPhotos.length === 2 ? 5.6 : 3.65);
      const startX = displayPhotos.length === 1 ? 2.8 : 0.6;
      const gapX = displayPhotos.length === 2 ? 0.6 : 0.42;

      for (let idx = 0; idx < displayPhotos.length; idx++) {
        const photo = displayPhotos[idx];
        const cx = startX + idx * (cardW + gapX);

        slideSite.addShape(pptx.ShapeType.roundRect, {
          x: cx,
          y: 1.15,
          w: cardW,
          h: 5.0,
          rectRadius: 0.08,
          fill: { color: 'F8FAFC' },
          line: { color: colors.borderGray, width: 1 },
        });

        const base64 = await getBase64Image(photo.url);
        if (base64) {
          slideSite.addImage({
            data: base64,
            x: cx + 0.15,
            y: 1.30,
            w: cardW - 0.3,
            h: 2.8,
            sizing: { type: 'contain', w: cardW - 0.3, h: 2.8 },
          });
        }

        slideSite.addShape(pptx.ShapeType.roundRect, {
          x: cx + 0.2,
          y: 4.25,
          w: 1.5,
          h: 0.22,
          rectRadius: 0.03,
          fill: { color: colors.accentBlue },
        });
        slideSite.addText(photo.workstream || 'Construction', {
          x: cx + 0.2,
          y: 4.25,
          w: 1.5,
          h: 0.22,
          fontSize: 7.5,
          bold: true,
          color: colors.white,
          align: 'center',
          valign: 'middle',
        });

        slideSite.addText(photo.caption || `Site Work Photo ${idx + 1}`, {
          x: cx + 0.2,
          y: 4.55,
          w: cardW - 0.4,
          h: 0.42,
          fontSize: 9.5,
          bold: true,
          color: colors.textDark,
        });

        slideSite.addText(`📍 ${photo.location || project.location}`, {
          x: cx + 0.2,
          y: 5.05,
          w: cardW - 0.4,
          h: 0.40,
          fontSize: 8,
          color: colors.textMuted,
        });

        slideSite.addText(`🕒 ${photo.date || report.reportingDate}`, {
          x: cx + 0.2,
          y: 5.55,
          w: cardW - 0.4,
          h: 0.25,
          fontSize: 8,
          bold: true,
          color: colors.accentOrange,
        });
      }
    } else {
      // 3 Executive Placeholder Gallery Cards matching EPC reporting standards
      const placeholderCards = [
        { title: 'Main Control Room & Switchyard', ws: 'Civil & Switchyard', desc: 'Control room plinth, switchgear foundation & battery room structural progress.' },
        { title: 'Solar Array Field & MMS Piling', ws: 'Solar PV Array', desc: 'Module mounting structures, borehole ramming & PV module string alignment.' },
        { title: '66kV Transmission & Bay Gantry', ws: 'Grid Evacuation', desc: 'Tower footing stub setting, conductor stringing & destination substation bay work.' },
      ];

      const cardW = 3.65;
      const startX = 0.60;
      const gapX = 0.42;

      placeholderCards.forEach((c, idx) => {
        const cx = startX + idx * (cardW + gapX);

        slideSite.addShape(pptx.ShapeType.roundRect, {
          x: cx,
          y: 1.15,
          w: cardW,
          h: 5.0,
          rectRadius: 0.08,
          fill: { color: 'F8FAFC' },
          line: { color: colors.borderGray, width: 1 },
        });

        // Blueprint photo frame
        slideSite.addShape(pptx.ShapeType.rect, {
          x: cx + 0.15,
          y: 1.30,
          w: cardW - 0.3,
          h: 2.8,
          fill: { color: '0F2A4A' },
          line: { color: colors.accentBlue, width: 1, dashType: 'dash' },
        });

        slideSite.addText('📷 PHOTO EVIDENCE PLACEHOLDER', {
          x: cx + 0.2,
          y: 2.20,
          w: cardW - 0.4,
          h: 0.35,
          fontSize: 9,
          bold: true,
          color: colors.accentAmber,
          align: 'center',
        });

        slideSite.addText('Awaiting Site Photo Upload\n(Upload ground evidence in "Site Progress" tab)', {
          x: cx + 0.2,
          y: 2.65,
          w: cardW - 0.4,
          h: 0.65,
          fontSize: 8,
          color: colors.white,
          align: 'center',
          lineSpacing: 16,
        });

        // Workstream badge
        slideSite.addShape(pptx.ShapeType.roundRect, {
          x: cx + 0.2,
          y: 4.25,
          w: 1.6,
          h: 0.22,
          rectRadius: 0.03,
          fill: { color: colors.accentBlue },
        });
        slideSite.addText(c.ws, {
          x: cx + 0.2,
          y: 4.25,
          w: 1.6,
          h: 0.22,
          fontSize: 7.5,
          bold: true,
          color: colors.white,
          align: 'center',
          valign: 'middle',
        });

        slideSite.addText(c.title, {
          x: cx + 0.2,
          y: 4.55,
          w: cardW - 0.4,
          h: 0.38,
          fontSize: 9.5,
          bold: true,
          color: colors.textDark,
        });

        slideSite.addText(c.desc, {
          x: cx + 0.2,
          y: 4.95,
          w: cardW - 0.4,
          h: 0.50,
          fontSize: 8,
          color: colors.textMuted,
        });

        slideSite.addText(`📍 ${project.location}  ·  Week ${report.weekNumber}`, {
          x: cx + 0.2,
          y: 5.55,
          w: cardW - 0.4,
          h: 0.25,
          fontSize: 8,
          bold: true,
          color: colors.accentOrange,
        });
      });
    }
  }

  // ==========================================
  // SLIDE 6: NEXT TWO WEEKS LOOK-AHEAD PLAN (ALL ITEMS ON ONE SLIDE - ADAPTIVE SIZING)
  // ==========================================
  if (includeNextTwoWeeks) {
    const rawNextItems = report.nextTwoWeeks && report.nextTwoWeeks.length > 0
      ? report.nextTwoWeeks
      : [
          { activityName: 'Transmission Line work in progress', dueDate: '2026-10-24', responsiblePerson: 'Electrical Project Manager', isCriticalPath: false, expectedProgress: 65, remarks: 'Tower foundation section B execution.' },
          { activityName: 'Switchyard & Pile Casting completion', dueDate: '2026-10-28', responsiblePerson: 'Civil Construction Head', isCriticalPath: true, expectedProgress: 45, remarks: 'Concrete curing and load testing.' },
          { activityName: 'TAQC Inspection for PCVCB & Metering Panel', dueDate: '2026-10-26', responsiblePerson: 'Quality Assurance Lead', isCriticalPath: true, expectedProgress: 100, remarks: 'Third party inspection team visiting vendor facility.' },
          { activityName: 'Excavation work for DC and AC cable trench', dueDate: '2026-10-27', responsiblePerson: 'Civil Site Engineer', isCriticalPath: false, expectedProgress: 50, remarks: 'Trenching along main inverter pathway.' },
          { activityName: 'Foundation of Inverter, Transformer, HT panel', dueDate: '2026-10-29', responsiblePerson: 'Civil Lead', isCriticalPath: true, expectedProgress: 40, remarks: 'Rebar binding for transformer plinths.' },
        ];

    const M = Math.max(1, rawNextItems.length);
    const totalRows = M + 1;
    const tableY = 1.05;
    const maxTableH = 5.15;
    const adaptiveRowH = Math.max(0.18, Math.min(0.32, maxTableH / totalRows));

    let adaptiveFontSize = 8.0;
    if (M > 18) adaptiveFontSize = 6.5;
    else if (M > 13) adaptiveFontSize = 7.0;
    else if (M > 9) adaptiveFontSize = 7.5;

    const slideNext = pptx.addSlide();
    slideNext.background = { color: 'FFFFFF' };
    addSlideHeader(slideNext, 'Next Two Weeks Look-Ahead Plan', pageCounter++);

    const tableHeaders: any[] = [
      { text: 'Task / Look-Ahead Activity', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white } },
      { text: 'Due Date', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white, align: 'center' as const } },
      { text: 'Responsible Lead', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white } },
      { text: 'Critical Path', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white, align: 'center' as const } },
      { text: 'Target %', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white, align: 'right' as const } },
      { text: 'Dependencies / Status Remarks', options: { bold: true, fill: { color: '0F2A4A' }, color: colors.white } },
    ];

    const tableData: any[] = [tableHeaders];

    rawNextItems.forEach((item: any) => {
      tableData.push([
        { text: item.activityName, options: { bold: true, color: colors.textDark } },
        { text: item.dueDate, options: { align: 'center' as const, bold: true, color: colors.accentOrange } },
        { text: item.responsiblePerson || 'Site Lead', options: { color: colors.textMuted } },
        {
          text: item.isCriticalPath ? 'Critical Path (CP)' : 'Normal',
          options: {
            align: 'center' as const,
            bold: true,
            color: item.isCriticalPath ? colors.accentRed : colors.accentBlue,
          },
        },
        { text: `${item.expectedProgress}%`, options: { align: 'right' as const, bold: true, color: colors.accentBlue } },
        { text: item.remarks || item.status || 'Scheduled on track', options: { color: colors.textDark, italic: true } },
      ]);
    });

    slideNext.addTable(tableData, {
      x: 0.6,
      y: tableY,
      w: 11.8,
      colW: [3.8, 1.4, 2.0, 1.5, 1.0, 2.1],
      rowH: adaptiveRowH,
      fontSize: adaptiveFontSize,
      border: { pt: 0.5, color: colors.borderGray },
      autoPage: false,
      margin: [1, 3, 1, 3],
    });

    const totalTableH = totalRows * adaptiveRowH;
    const footerY = Math.min(6.50, tableY + totalTableH + 0.12);

    slideNext.addText('14-day rolling milestone execution plan synchronized with project critical path.', {
      x: 0.6,
      y: footerY,
      w: 10.0,
      h: 0.22,
      fontSize: 8.0,
      italic: true,
      color: colors.textMuted,
    });
  }

  // ==========================================
  // SLIDE 7: RISKS AND CLIENT ACTIONS (STRICT BOUNDARIES)
  // ==========================================
  if (includeRisks) {
    const slideRisks = pptx.addSlide();
    slideRisks.background = { color: 'FFFFFF' };
    addSlideHeader(slideRisks, 'Risks and Client Actions', pageCounter++);

    // Left Column: RISKS (x: 0.60 to 6.25, y: 1.05 to 6.30)
    slideRisks.addShape(pptx.ShapeType.roundRect, {
      x: 0.60,
      y: 1.05,
      w: 5.65,
      h: 5.25,
      rectRadius: 0.08,
      fill: { color: 'F8FAFC' },
      line: { color: colors.borderGray, width: 1 },
    });

    slideRisks.addShape(pptx.ShapeType.rect, {
      x: 0.60,
      y: 1.05,
      w: 5.65,
      h: 0.32,
      fill: { color: '0F2A4A' },
    });
    slideRisks.addText('PROJECT RISKS & BOTTLENECK ITEMS', {
      x: 0.80,
      y: 1.05,
      w: 5.25,
      h: 0.32,
      fontSize: 9,
      bold: true,
      color: colors.white,
      valign: 'middle',
    });

    const displayRisks = (report.risks && report.risks.length > 0 ? report.risks : [
      { id: 'r1', title: 'Bay Work Execution Clearance', category: 'Approvals', description: 'Pending clearance for 66kV KPTCL substation bay work.', probability: 'High', impact: 'High', riskLevel: 'Critical', responsiblePerson: 'Liaison Lead', mitigationPlan: 'Escalate to Chief Engineer KPTCL.', currentStatus: 'Open', clientSupportRequired: 'Executive intervention needed.' }
    ]).slice(0, 3);

    displayRisks.forEach((risk, idx) => {
      const ry = 1.48 + idx * 1.55;
      slideRisks.addShape(pptx.ShapeType.roundRect, {
        x: 0.80,
        y: ry,
        w: 5.25,
        h: 1.45,
        rectRadius: 0.06,
        fill: { color: 'FFF5F5' },
        line: { color: 'FCA5A5', width: 0.8 },
      });

      slideRisks.addText(risk.title, {
        x: 0.95,
        y: ry + 0.08,
        w: 3.75,
        h: 0.25,
        fontSize: 10,
        bold: true,
        color: colors.accentRed,
      });

      slideRisks.addShape(pptx.ShapeType.rect, {
        x: 4.90,
        y: ry + 0.10,
        w: 1.0,
        h: 0.22,
        fill: { color: colors.accentRed },
      });
      slideRisks.addText((risk.currentStatus || 'OPEN').toUpperCase(), {
        x: 4.90,
        y: ry + 0.10,
        w: 1.0,
        h: 0.22,
        fontSize: 7.5,
        bold: true,
        color: colors.white,
        align: 'center',
        valign: 'middle',
      });

      slideRisks.addText(risk.description, {
        x: 0.95,
        y: ry + 0.35,
        w: 4.95,
        h: 0.50,
        fontSize: 8.5,
        color: colors.textDark,
      });

      slideRisks.addText(`Impact: ${risk.impact || 'High'} | Mitigation: ${risk.mitigationPlan || 'Action initiated'}`, {
        x: 0.95,
        y: ry + 0.90,
        w: 4.95,
        h: 0.45,
        fontSize: 7.5,
        color: colors.textMuted,
        italic: true,
      });
    });

    // If more than 3 risks, create an overflow risks slide
    if (report.risks && report.risks.length > 3) {
      const remainingRisks = report.risks.slice(3);
      const overflowSlide = pptx.addSlide();
      overflowSlide.background = { color: 'FFFFFF' };
      addSlideHeader(overflowSlide, 'Additional Project Risks (Continued)', pageCounter++);

      remainingRisks.slice(0, 4).forEach((risk, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const rx = col === 0 ? 0.6 : 6.75;
        const ry = 1.05 + row * 2.6;

        overflowSlide.addShape(pptx.ShapeType.roundRect, {
          x: rx,
          y: ry,
          w: 5.65,
          h: 2.4,
          rectRadius: 0.08,
          fill: { color: 'FFF5F5' },
          line: { color: 'FCA5A5', width: 1 },
        });

        overflowSlide.addText(risk.title, {
          x: rx + 0.2,
          y: ry + 0.15,
          w: 4.2,
          h: 0.3,
          fontSize: 11,
          bold: true,
          color: colors.accentRed,
        });

        overflowSlide.addShape(pptx.ShapeType.rect, {
          x: rx + 4.4,
          y: ry + 0.18,
          w: 1.0,
          h: 0.24,
          fill: { color: colors.accentRed },
        });
        overflowSlide.addText((risk.currentStatus || 'OPEN').toUpperCase(), {
          x: rx + 4.4,
          y: ry + 0.18,
          w: 1.0,
          h: 0.24,
          fontSize: 8,
          bold: true,
          color: colors.white,
          align: 'center',
          valign: 'middle',
        });

        overflowSlide.addText(risk.description, {
          x: rx + 0.2,
          y: ry + 0.55,
          w: 5.25,
          h: 0.75,
          fontSize: 9,
          color: colors.textDark,
        });

        overflowSlide.addText(`Impact: ${risk.impact || 'High'}\nMitigation: ${risk.mitigationPlan || 'Action planned'}\nLead: ${risk.responsiblePerson || 'Project Manager'}`, {
          x: rx + 0.2,
          y: ry + 1.40,
          w: 5.25,
          h: 0.85,
          fontSize: 8,
          color: colors.textMuted,
          italic: true,
        });
      });
    }

    // Right Column: WHAT WE NEED FROM YOU (x: 6.75 to 12.40, y: 1.05 to 6.30)
    slideRisks.addShape(pptx.ShapeType.roundRect, {
      x: 6.75,
      y: 1.05,
      w: 5.65,
      h: 5.25,
      rectRadius: 0.08,
      fill: { color: '0F2A4A' },
      line: { color: colors.accentOrange, width: 1 },
    });

    slideRisks.addShape(pptx.ShapeType.rect, {
      x: 6.75,
      y: 1.05,
      w: 5.65,
      h: 0.32,
      fill: { color: colors.accentOrange },
    });
    slideRisks.addText('WHAT WE NEED FROM YOU', {
      x: 6.95,
      y: 1.05,
      w: 5.25,
      h: 0.32,
      fontSize: 9,
      bold: true,
      color: colors.white,
      valign: 'middle',
    });

    slideRisks.addText(`Client points of contact: ${project.contractorName || 'Dexler'} Project Delivery team.`, {
      x: 6.95,
      y: 1.48,
      w: 5.25,
      h: 0.25,
      fontSize: 8.5,
      color: colors.accentSky,
      bold: true,
    });

    const clientActions = [
      'Awaiting signed Shareholding Agreement from Swelect - critical dependency for Government Order name transfer amendment with Energy Department.',
      'Request for 25% milestone payment towards Class 1 equipment and balance of plant materials.',
      'Endorsement on KPTCL 66kV bay work shutdown coordination requisition for transmission line tie-in.',
      'Confirmation of site inspection schedule with technical audit team.',
    ];

    clientActions.forEach((act, idx) => {
      const ay = 1.95 + idx * 1.02;
      slideRisks.addShape(pptx.ShapeType.diamond, {
        x: 6.95,
        y: ay + 0.05,
        w: 0.15,
        h: 0.15,
        fill: { color: colors.accentOrange },
      });
      slideRisks.addText(act, {
        x: 7.25,
        y: ay,
        w: 4.95,
        h: 0.90,
        fontSize: 9,
        color: colors.white,
        lineSpacing: 16,
      });
    });
  }

  // ==========================================
  // SLIDE 8: WEEKLY ACHIEVEMENTS & SUMMARY (STRICT BOUNDARIES)
  // ==========================================
  if (includeSummary) {
    const slideSummary = pptx.addSlide();
    slideSummary.background = { color: 'FFFFFF' };
    addSlideHeader(slideSummary, 'Weekly Summary & Achievements', pageCounter++);

    // 4 Executive Quadrants across x: [0.60, 12.40] and y: [1.05, 6.25]
    const cardW = 5.65;
    const cardH = 2.50;
    const quadrants = [
      {
        title: 'COMPLETED THIS WEEK',
        iconColor: colors.accentGreen,
        x: 0.60,
        y: 1.05,
        items: report.summary.completedThisWeek.slice(0, 3),
      },
      {
        title: 'ONGOING ACTIVITIES',
        iconColor: colors.accentBlue,
        x: 6.75,
        y: 1.05,
        items: report.summary.ongoingActivities.slice(0, 3),
      },
      {
        title: 'DELAYED ITEMS & CORRECTIVE ACTIONS',
        iconColor: colors.accentRed,
        x: 0.60,
        y: 3.75,
        items: report.summary.correctiveActions.length > 0
          ? report.summary.correctiveActions.slice(0, 3)
          : report.summary.delayedActivities.slice(0, 3),
      },
      {
        title: 'NEXT WEEK TARGETS & MANAGEMENT COMMENTS',
        iconColor: colors.accentAmber,
        x: 6.75,
        y: 3.75,
        items: report.summary.nextWeekTargets.slice(0, 3),
      },
    ];

    quadrants.forEach(q => {
      slideSummary.addShape(pptx.ShapeType.roundRect, {
        x: q.x,
        y: q.y,
        w: cardW,
        h: cardH,
        rectRadius: 0.08,
        fill: { color: 'F8FAFC' },
        line: { color: colors.borderGray, width: 1 },
      });

      slideSummary.addShape(pptx.ShapeType.rect, {
        x: q.x,
        y: q.y,
        w: cardW,
        h: 0.32,
        fill: { color: q.iconColor },
      });
      slideSummary.addText(q.title, {
        x: q.x + 0.15,
        y: q.y,
        w: cardW - 0.3,
        h: 0.32,
        fontSize: 8.5,
        bold: true,
        color: colors.white,
        valign: 'middle',
      });

      q.items.forEach((item, ii) => {
        const itemY = q.y + 0.42 + ii * 0.64;
        slideSummary.addShape(pptx.ShapeType.rect, {
          x: q.x + 0.2,
          y: itemY + 0.06,
          w: 0.06,
          h: 0.24,
          fill: { color: q.iconColor },
        });
        slideSummary.addText(item, {
          x: q.x + 0.35,
          y: itemY,
          w: cardW - 0.55,
          h: 0.58,
          fontSize: 8.5,
          color: colors.textDark,
        });
      });
    });
  }

  // Generate & trigger browser download
  const safeFilename = `${project.clientName.replace(/\s+/g, '_')}_Weekly_Project_Report_Wk${report.weekNumber}.pptx`;
  await pptx.writeFile({ fileName: safeFilename });
};