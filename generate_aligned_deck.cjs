const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

async function buildAlignedPresentation() {
  console.log('Building pristine aligned presentation matching Reference PPT standards...');

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 13.333" x 7.5"
  pptx.author = 'Dexler Energy Project Delivery';
  pptx.company = 'Dexler Energy';
  pptx.subject = 'Swelect Energy Systems Ltd - Weekly Project Report (Week 43)';
  pptx.title = 'Swelect Energy Systems Ltd - Weekly Project Report';

  // Executive Enterprise Color Palette
  const colors = {
    navyBg: '0B1528',
    cardBg: 'F8FAFC',
    cardBorder: 'CBD5E1',
    headerBg: '0F2A4A',
    textDark: '0F172A',
    textMuted: '64748B',
    accentBlue: '0066FF',
    accentSky: '38BDF8',
    accentOrange: 'FF7A00',
    accentAmber: 'F59E0B',
    accentGreen: '10B981',
    accentRed: 'EF4444',
    white: 'FFFFFF',
    borderGray: 'E2E8F0',
    trackBg: 'E2E8F0',
  };

  const logoPath = path.resolve('extracted_media/image1.png');
  const coverPath = path.resolve('extracted_media/image2.png');
  const photo1Path = path.resolve('extracted_media/image3.png');
  const photo2Path = path.resolve('extracted_media/image4.png');
  const photo3Path = path.resolve('extracted_media/image5.jpeg');

  const hasLogo = fs.existsSync(logoPath);
  const hasCover = fs.existsSync(coverPath);
  const hasPhoto1 = fs.existsSync(photo1Path);
  const hasPhoto2 = fs.existsSync(photo2Path);
  const hasPhoto3 = fs.existsSync(photo3Path);

  // Helper for strictly bounded slide headers
  const addSlideHeader = (slide, title, pageNum) => {
    // Top Confidential Line
    slide.addText('Confidential. Prepared for Swelect Energy Systems Ltd by Dexler Energy.', {
      x: 0.60,
      y: 0.22,
      w: 7.50,
      h: 0.26,
      fontSize: 8.5,
      color: colors.textMuted,
      fontFace: 'Arial',
    });

    // Top Right Dexler Logo / Text
    if (hasLogo) {
      slide.addImage({
        path: logoPath,
        x: 10.60,
        y: 0.16,
        w: 1.80,
        h: 0.38,
      });
    } else {
      slide.addText('DEXLER ENERGY', {
        x: 8.40,
        y: 0.20,
        w: 4.00,
        h: 0.28,
        fontSize: 12,
        bold: true,
        color: colors.accentBlue,
        align: 'right',
        fontFace: 'Arial',
      });
    }

    // Title line
    slide.addText(title, {
      x: 0.60,
      y: 0.50,
      w: 7.50,
      h: 0.42,
      fontSize: 17,
      bold: true,
      color: colors.textDark,
      fontFace: 'Arial',
    });

    // Metadata right
    slide.addText('Swelect Energy Systems Ltd  ·  Week 43  ·  17 Oct 2026', {
      x: 7.20,
      y: 0.52,
      w: 5.20,
      h: 0.32,
      fontSize: 9.5,
      color: colors.textMuted,
      align: 'right',
      fontFace: 'Arial',
    });

    // Page Number strictly inside boundary
    slide.addText(`${pageNum}`, {
      x: 11.80,
      y: 6.65,
      w: 0.60,
      h: 0.25,
      fontSize: 9,
      color: colors.textMuted,
      align: 'right',
    });
  };

  // ==========================================
  // SLIDE 1: EXECUTIVE COVER PAGE
  // ==========================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: colors.white };

  // Header
  slide1.addText('Confidential. Prepared for Swelect Energy Systems Ltd by Dexler Energy.', {
    x: 0.60,
    y: 0.25,
    w: 7.50,
    h: 0.26,
    fontSize: 8.5,
    color: colors.textMuted,
    fontFace: 'Arial',
  });

  if (hasLogo) {
    slide1.addImage({
      path: logoPath,
      x: 10.40,
      y: 0.20,
      w: 2.00,
      h: 0.42,
    });
  }

  // Left Column Content
  slide1.addText('DEVELOPERS OF SOLAR POWER PLANTS', {
    x: 0.60,
    y: 1.05,
    w: 6.00,
    h: 0.28,
    fontSize: 10,
    bold: true,
    color: colors.accentOrange,
    fontFace: 'Arial',
  });

  slide1.addText('Weekly Project Report', {
    x: 0.60,
    y: 1.35,
    w: 6.00,
    h: 0.65,
    fontSize: 30,
    bold: true,
    color: colors.textDark,
    fontFace: 'Arial',
  });

  // Week pill badge
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 0.60,
    y: 2.10,
    w: 1.35,
    h: 0.34,
    rectRadius: 0.06,
    fill: { color: colors.accentBlue },
  });
  slide1.addText('WEEK 43', {
    x: 0.60,
    y: 2.10,
    w: 1.35,
    h: 0.34,
    fontSize: 10.5,
    bold: true,
    color: colors.white,
    align: 'center',
    valign: 'middle',
    fontFace: 'Arial',
  });

  slide1.addText('Reporting week ending 17 Oct 2026', {
    x: 2.10,
    y: 2.12,
    w: 4.50,
    h: 0.30,
    fontSize: 11,
    color: colors.textMuted,
    fontFace: 'Arial',
  });

  // 2x2 Grid of Structured Cards
  const cards = [
    { label: 'CLIENT', val: 'Swelect Energy Systems Ltd', x: 0.60, y: 2.75, w: 2.85, h: 1.15 },
    { label: 'PROJECT', val: '5 MW AC / 7 MWp DC ground-mount solar park', x: 3.65, y: 2.75, w: 2.85, h: 1.15 },
    { label: 'LOCATION', val: 'Pallaghatta, Karnataka', x: 0.60, y: 4.10, w: 2.85, h: 1.15 },
    { label: 'COMMISSIONING (COD)', val: '28 Nov 2026 baseline\nForecast 18 Dec 2026', x: 3.65, y: 4.10, w: 2.85, h: 1.15 },
  ];

  cards.forEach(c => {
    slide1.addShape(pptx.ShapeType.roundRect, {
      x: c.x,
      y: c.y,
      w: c.w,
      h: c.h,
      rectRadius: 0.06,
      fill: { color: colors.cardBg },
      line: { color: colors.cardBorder, width: 1 },
    });
    slide1.addText(c.label, {
      x: c.x + 0.15,
      y: c.y + 0.12,
      w: c.w - 0.30,
      h: 0.20,
      fontSize: 8.0,
      bold: true,
      color: colors.accentOrange,
      fontFace: 'Arial',
    });
    slide1.addText(c.val, {
      x: c.x + 0.15,
      y: c.y + 0.36,
      w: c.w - 0.30,
      h: c.h - 0.44,
      fontSize: 10.0,
      bold: true,
      color: colors.textDark,
      fontFace: 'Arial',
    });
  });

  // Footer note
  slide1.addText('Prepared by Project Delivery, Dexler Energy', {
    x: 0.60,
    y: 5.60,
    w: 5.90,
    h: 0.30,
    fontSize: 9.5,
    italic: true,
    color: colors.textMuted,
    fontFace: 'Arial',
  });

  // Right Column: Framed Photo Container
  const photoBoxX = 6.80;
  const photoBoxY = 1.05;
  const photoBoxW = 5.60;
  const photoBoxH = 4.85;

  slide1.addShape(pptx.ShapeType.roundRect, {
    x: photoBoxX,
    y: photoBoxY,
    w: photoBoxW,
    h: photoBoxH,
    rectRadius: 0.08,
    fill: { color: 'F1F5F9' },
    line: { color: colors.cardBorder, width: 1 },
  });

  if (hasCover) {
    slide1.addImage({
      path: coverPath,
      x: photoBoxX + 0.06,
      y: photoBoxY + 0.06,
      w: photoBoxW - 0.12,
      h: photoBoxH - 0.48,
    });
    // Caption bar
    slide1.addShape(pptx.ShapeType.rect, {
      x: photoBoxX + 0.06,
      y: photoBoxY + photoBoxH - 0.42,
      w: photoBoxW - 0.12,
      h: 0.36,
      fill: { color: colors.navyBg },
    });
    slide1.addText('Pallaghatta 5MW Solar Park · Site Construction & Commissioning Track', {
      x: photoBoxX + 0.15,
      y: photoBoxY + photoBoxH - 0.42,
      w: photoBoxW - 0.30,
      h: 0.36,
      fontSize: 8.5,
      bold: true,
      color: colors.white,
      valign: 'middle',
    });
  }

  // Page 1
  slide1.addText('1', {
    x: 11.80,
    y: 6.65,
    w: 0.60,
    h: 0.25,
    fontSize: 9,
    color: colors.textMuted,
    align: 'right',
  });

  // ==========================================
  // SLIDE 2: DELIVERY TIMELINE & WORKSTREAM GANTT
  // ==========================================
  const slide2 = pptx.addSlide();
  slide2.background = { color: colors.white };
  addSlideHeader(slide2, 'Delivery Timeline', 2);

  // Top 3 KPI Cards (Y = 1.05", H = 0.95")
  const topKpis = [
    { title: 'OVERALL PROGRESS', val: '36%', sub: 'Plan: 66.1%  ·  -30.1% Behind', subColor: colors.accentRed, x: 0.60 },
    { title: 'DAYS TO COD', val: '42', sub: 'Forecast: 63 days (+21d slip)', subColor: colors.accentRed, x: 4.65 },
    { title: 'COMMISSIONING DATE', val: '28 Nov 2026', sub: 'Forecast COD: 18 Dec 2026  ·  HOTO: 31 Jan 2027', subColor: colors.accentAmber, x: 8.70 },
  ];

  topKpis.forEach(k => {
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: k.x,
      y: 1.05,
      w: 3.70,
      h: 0.95,
      rectRadius: 0.06,
      fill: { color: colors.cardBg },
      line: { color: colors.cardBorder, width: 1 },
    });
    slide2.addText(k.title, {
      x: k.x + 0.15,
      y: 1.13,
      w: 3.40,
      h: 0.18,
      fontSize: 7.5,
      bold: true,
      color: colors.accentOrange,
      fontFace: 'Arial',
    });
    slide2.addText(k.val, {
      x: k.x + 0.15,
      y: 1.30,
      w: 1.50,
      h: 0.40,
      fontSize: 22,
      bold: true,
      color: colors.accentBlue,
      fontFace: 'Arial',
    });
    slide2.addText(k.sub, {
      x: k.x + 1.45,
      y: 1.38,
      w: 2.10,
      h: 0.30,
      fontSize: 7.8,
      bold: true,
      color: k.subColor,
      align: 'right',
      fontFace: 'Arial',
    });
  });

  // Bottom-Left: Workstream Gantt Timeline (X = 0.60", W = 7.10", Y = 2.15" to 6.30")
  const gL = 0.60;
  const gT = 2.15;
  const gW = 7.10;
  const gH = 4.15;

  slide2.addShape(pptx.ShapeType.roundRect, {
    x: gL,
    y: gT,
    w: gW,
    h: gH,
    rectRadius: 0.06,
    fill: { color: colors.white },
    line: { color: colors.cardBorder, width: 1 },
  });

  // Header row for months (Jul to Jan)
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const monthPlotX = gL + 2.45;
  const monthPlotW = gW - 2.55;
  const colW = monthPlotW / months.length;

  slide2.addText('Workstream', {
    x: gL + 0.15,
    y: gT + 0.08,
    w: 2.20,
    h: 0.24,
    fontSize: 8.5,
    bold: true,
    color: colors.textDark,
  });

  months.forEach((m, idx) => {
    slide2.addText(m, {
      x: monthPlotX + idx * colW,
      y: gT + 0.08,
      w: colW,
      h: 0.24,
      fontSize: 8.0,
      bold: true,
      align: 'center',
      color: colors.textMuted,
    });
    // Vertical grid line
    slide2.addShape(pptx.ShapeType.line, {
      x: monthPlotX + idx * colW,
      y: gT + 0.32,
      w: 0,
      h: gH - 0.70,
      line: { color: 'F1F5F9', width: 0.5, dashType: 'dash' },
    });
  });

  // TODAY line (17 Oct -> approx 3.55 months from Jul 1)
  const todayRel = 3.55 / 7.0;
  const todayLineX = monthPlotX + todayRel * monthPlotW;
  slide2.addShape(pptx.ShapeType.line, {
    x: todayLineX,
    y: gT + 0.30,
    w: 0,
    h: gH - 0.68,
    line: { color: colors.accentAmber, width: 1.5, dashType: 'dash' },
  });
  slide2.addText('TODAY', {
    x: todayLineX - 0.25,
    y: gT + 0.10,
    w: 0.50,
    h: 0.18,
    fontSize: 6.5,
    bold: true,
    color: colors.accentAmber,
    align: 'center',
  });

  // 12 Workstreams from PPT1 with original dates and progress percentages
  const workstreams = [
    { name: 'Land', pct: 33, dates: '31 May – 25 Sep', startM: 0.0, durM: 2.8, status: 'Delayed' },
    { name: 'Approvals', pct: 2, dates: '03 Sep – 28 Nov', startM: 2.1, durM: 2.9, status: 'Delayed' },
    { name: 'CEIG Approval', pct: 5, dates: '01 Oct – 04 Nov', startM: 3.0, durM: 1.1, status: 'Delayed' },
    { name: 'WBA', pct: 0, dates: '01 Oct – 31 Oct', startM: 3.0, durM: 1.0, status: 'Delayed' },
    { name: 'Bay Work', pct: 0, dates: '01 Oct – 17 Nov', startM: 3.0, durM: 1.6, status: 'Delayed' },
    { name: 'Transmission Line', pct: 52, dates: '10 Sep – 10 Oct', startM: 2.3, durM: 1.0, status: 'Delayed' },
    { name: 'Site Land Prep', pct: 100, dates: '04 Sep – 09 Sep', startM: 2.1, durM: 0.2, status: 'Complete' },
    { name: 'Detailed Engineering', pct: 100, dates: '05 Sep – 23 Sep', startM: 2.1, durM: 0.6, status: 'Complete' },
    { name: 'Procurement & Delivery', pct: 34, dates: '03 Aug – 09 Nov', startM: 1.1, durM: 3.2, status: 'Delayed' },
    { name: 'Construction', pct: 22, dates: '15 Sep – 03 Dec', startM: 2.5, durM: 2.6, status: 'Delayed' },
    { name: 'Handover (HOTO)', pct: 0, dates: '28 Nov – 15 Dec', startM: 4.9, durM: 0.6, status: 'Delayed' },
    { name: 'Compound Wall', pct: 50, dates: '07 Sep – 27 Oct', startM: 2.2, durM: 1.7, status: 'Delayed' },
  ];

  const rowH = 0.26;
  const startY = gT + 0.38;

  workstreams.forEach((ws, idx) => {
    const ry = startY + idx * rowH;
    // Row zebra background
    if (idx % 2 === 1) {
      slide2.addShape(pptx.ShapeType.rect, {
        x: gL + 0.05,
        y: ry - 0.02,
        w: gW - 0.10,
        h: rowH,
        fill: { color: 'F8FAFC' },
      });
    }

    // Workstream label
    slide2.addText(ws.name, {
      x: gL + 0.15,
      y: ry,
      w: 2.20,
      h: rowH - 0.04,
      fontSize: 7.2,
      bold: true,
      color: colors.textDark,
    });

    // Bar track
    const barX = monthPlotX + (ws.startM / 7.0) * monthPlotW;
    const barW = Math.max(0.20, (ws.durM / 7.0) * monthPlotW);

    slide2.addShape(pptx.ShapeType.roundRect, {
      x: barX,
      y: ry + 0.04,
      w: barW,
      h: 0.12,
      rectRadius: 0.02,
      fill: { color: colors.trackBg },
    });

    // Progress fill
    const progW = barW * (ws.pct / 100);
    if (progW > 0) {
      let fillColor = colors.accentBlue;
      if (ws.pct === 100) fillColor = colors.accentGreen;
      else if (ws.status === 'Delayed') fillColor = colors.accentRed;

      slide2.addShape(pptx.ShapeType.roundRect, {
        x: barX,
        y: ry + 0.04,
        w: progW,
        h: 0.12,
        rectRadius: 0.02,
        fill: { color: fillColor },
      });
    }

    // Progress % badge
    slide2.addText(`${ws.pct}%`, {
      x: barX + barW + 0.05,
      y: ry,
      w: 0.45,
      h: rowH - 0.04,
      fontSize: 6.8,
      bold: true,
      color: ws.pct === 100 ? colors.accentGreen : (ws.status === 'Delayed' ? colors.accentRed : colors.accentBlue),
    });
  });

  // Legend at bottom of timeline card
  const legY = gT + gH - 0.30;
  slide2.addShape(pptx.ShapeType.rect, { x: gL + 0.20, y: legY + 0.04, w: 0.16, h: 0.10, fill: { color: colors.accentBlue } });
  slide2.addText('Progress to date', { x: gL + 0.40, y: legY, w: 1.10, h: 0.18, fontSize: 7.0, color: colors.textMuted });

  slide2.addShape(pptx.ShapeType.rect, { x: gL + 1.60, y: legY + 0.04, w: 0.16, h: 0.10, fill: { color: colors.accentRed } });
  slide2.addText('Behind schedule', { x: gL + 1.80, y: legY, w: 1.10, h: 0.18, fontSize: 7.0, color: colors.textMuted });

  slide2.addShape(pptx.ShapeType.rect, { x: gL + 3.00, y: legY + 0.04, w: 0.16, h: 0.10, fill: { color: colors.accentGreen } });
  slide2.addText('Complete', { x: gL + 3.20, y: legY, w: 0.90, h: 0.18, fontSize: 7.0, color: colors.textMuted });

  slide2.addShape(pptx.ShapeType.line, { x: gL + 4.20, y: legY + 0.09, w: 0.20, h: 0, line: { color: colors.accentAmber, width: 1.5, dashType: 'dash' } });
  slide2.addText('Planned position today', { x: gL + 4.45, y: legY, w: 1.40, h: 0.18, fontSize: 7.0, color: colors.textMuted });

  // Bottom-Right: Key Milestones Container (X = 7.90", W = 4.50", Y = 2.15" to 6.30")
  const mX = 7.90;
  const mW = 4.50;
  const mH = 4.15;

  slide2.addShape(pptx.ShapeType.roundRect, {
    x: mX,
    y: gT,
    w: mW,
    h: mH,
    rectRadius: 0.06,
    fill: { color: colors.cardBg },
    line: { color: colors.cardBorder, width: 1 },
  });

  slide2.addText('KEY STAGE MILESTONES', {
    x: mX + 0.20,
    y: gT + 0.12,
    w: mW - 0.40,
    h: 0.22,
    fontSize: 8.5,
    bold: true,
    color: colors.accentOrange,
  });

  const milestones = [
    { num: '1', name: 'CEIG approval', date: '04 Nov 26', status: 'Delayed / Critical Path' },
    { num: '2', name: 'PV module installation', date: '06 Nov 26', status: 'In Progress' },
    { num: '3', name: 'Bay work completion', date: '17 Nov 26', status: 'Critical Path' },
    { num: '4', name: 'Synchronisation approval', date: '27 Nov 26', status: 'Statutory Gate' },
    { num: '5', name: 'Commissioning (COD)', date: '28 Nov 26', status: 'Contractual COD' },
    { num: '6', name: 'Final handover (HOTO)', date: '15 Dec 26', status: 'Final Handover' },
  ];

  const mRowH = 0.54;
  const mStartY = gT + 0.42;

  milestones.forEach((ms, idx) => {
    const my = mStartY + idx * mRowH;
    // Milestone number circle badge
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: mX + 0.20,
      y: my + 0.04,
      w: 0.32,
      h: 0.32,
      rectRadius: 0.16,
      fill: { color: colors.accentBlue },
    });
    slide2.addText(ms.num, {
      x: mX + 0.20,
      y: my + 0.04,
      w: 0.32,
      h: 0.32,
      fontSize: 9.0,
      bold: true,
      color: colors.white,
      align: 'center',
      valign: 'middle',
    });

    // Milestone details
    slide2.addText(ms.name, {
      x: mX + 0.62,
      y: my,
      w: 2.40,
      h: 0.22,
      fontSize: 8.2,
      bold: true,
      color: colors.textDark,
    });
    slide2.addText(ms.status, {
      x: mX + 0.62,
      y: my + 0.22,
      w: 2.40,
      h: 0.18,
      fontSize: 7.0,
      color: colors.textMuted,
    });

    // Date tag
    slide2.addText(ms.date, {
      x: mX + 3.05,
      y: my + 0.05,
      w: 1.25,
      h: 0.26,
      fontSize: 8.5,
      bold: true,
      align: 'right',
      color: ms.num === '5' ? colors.accentOrange : colors.textDark,
    });

    // Divider line
    if (idx < milestones.length - 1) {
      slide2.addShape(pptx.ShapeType.line, {
        x: mX + 0.20,
        y: my + mRowH - 0.02,
        w: mW - 0.40,
        h: 0,
        line: { color: colors.borderGray, width: 0.5 },
      });
    }
  });

  // Source footnote
  slide2.addText('Source: Swelect Gantt sheet · 12 workstreams · 6 milestone gates strictly bounded', {
    x: mX + 0.20,
    y: gT + mH - 0.30,
    w: mW - 0.40,
    h: 0.20,
    fontSize: 6.8,
    italic: true,
    color: colors.textMuted,
  });

  // ==========================================
  // SLIDE 3: STATUS DETAILS (ALL WEEKLY ACTIVITIES TOGETHER ON ONE SLIDE)
  // ==========================================
  const slide3 = pptx.addSlide();
  slide3.background = { color: colors.white };
  addSlideHeader(slide3, 'Status Detail  ·  week ending 17 Oct', 3);

  // Complete Weekly Activities from PPT1
  const activities = [
    { wbs: '1.1', name: 'TB Meeting & Bay Estimate', date: '19 Sep 26', status: 'Delayed 20 d · CP', prog: 0 },
    { wbs: '1.2', name: 'New GO Application for Additional 2 MW', date: '23 Sep 26', status: 'Delayed 16 d · CP', prog: 30 },
    { wbs: '1.3', name: 'NA Conversion', date: '25 Sep 26', status: 'Delayed 14 d · CP', prog: 0 },
    { wbs: '1.4', name: 'Hudbast survey', date: '25 Sep 26', status: 'Delayed 14 d · CP', prog: 0 },
    { wbs: '1.5', name: 'Bay Work Payment Intimation', date: '25 Sep 26', status: 'Delayed 14 d · CP', prog: 0 },
    { wbs: '1.6', name: 'Bay Work Taken Approval', date: '01 Oct 26', status: 'Delayed 8 d · CP', prog: 0 },
    { wbs: '2.1', name: 'DC cables', date: '25 Sep 26', status: 'Delayed 14 d', prog: 40 },
    { wbs: '2.2', name: 'Control room', date: '25 Sep 26', status: 'Delayed 14 d', prog: 0 },
    { wbs: '3.1', name: 'Transmission Line', date: '10 Oct 26', status: 'In progress', prog: 50 },
    { wbs: '2.3', name: 'Inverter', date: '15 Oct 26', status: 'In progress', prog: 35 },
    { wbs: '2.4', name: 'Inverter Transformer', date: '17 Oct 26', status: 'In progress · CP', prog: 35 },
    { wbs: '4.1', name: 'MCS Drawing, Street Light, SCADA cable Laying (Drawings)', date: '23 Sep 26', status: 'Completed 30 Sep', prog: 100 },
    { wbs: '4.2', name: 'Solar Module (Supply)', date: '28 Sep 26', status: 'Completed 25 Sep', prog: 100 },
  ];

  const tableHeaders = [
    { text: 'WBS', options: { bold: true, fill: { color: colors.headerBg }, color: colors.white, align: 'center' } },
    { text: 'Task / Activity Name', options: { bold: true, fill: { color: colors.headerBg }, color: colors.white } },
    { text: 'Planned Finish', options: { bold: true, fill: { color: colors.headerBg }, color: colors.white, align: 'center' } },
    { text: 'Status & Delay', options: { bold: true, fill: { color: colors.headerBg }, color: colors.white, align: 'center' } },
    { text: 'Progress', options: { bold: true, fill: { color: colors.headerBg }, color: colors.white, align: 'right' } },
  ];

  const tableRows = [tableHeaders];

  activities.forEach(a => {
    let statusColor = colors.textDark;
    if (a.status.includes('Delayed')) statusColor = colors.accentRed;
    else if (a.status.includes('Completed')) statusColor = colors.accentGreen;
    else if (a.status.includes('CP')) statusColor = colors.accentOrange;
    else statusColor = colors.accentBlue;

    tableRows.push([
      { text: a.wbs, options: { align: 'center', color: colors.textMuted } },
      { text: a.name, options: { bold: true, color: colors.textDark } },
      { text: a.date, options: { align: 'center', color: colors.textMuted } },
      { text: a.status, options: { bold: true, align: 'center', color: statusColor, margin: [1, 6, 1, 6] } },
      { text: `${a.prog}%`, options: { bold: true, align: 'right', color: a.prog === 100 ? colors.accentGreen : colors.accentBlue } },
    ]);
  });

  // Table on Slide 3 with generous column width: Status & Delay has a full 3.00 inches!
  slide3.addTable(tableRows, {
    x: 0.60,
    y: 1.05,
    w: 11.80,
    colW: [0.70, 5.20, 1.50, 3.00, 1.40],
    rowH: 0.35,
    fontSize: 7.8,
    border: { pt: 0.5, color: colors.cardBorder },
    autoPage: false,
    margin: [1, 5, 1, 5],
  });

  // Footer text
  slide3.addText('+ 18 further open items in the project Gantt  ·  Complete weekly schedule tracked in single view', {
    x: 0.60,
    y: 6.25,
    w: 10.00,
    h: 0.22,
    fontSize: 8.0,
    italic: true,
    color: colors.textMuted,
  });

  // ==========================================
  // SLIDE 4: SITE PROGRESS & NEXT TWO WEEKS LOOK-AHEAD
  // ==========================================
  const slide4 = pptx.addSlide();
  slide4.background = { color: colors.white };
  addSlideHeader(slide4, 'Site Progress & Next Two Weeks Look-Ahead', 4);

  // Top Half: 3 Authentic Site Photos (Y = 1.05" to 3.50", H = 2.45")
  const photoW = 3.70;
  const photoH = 2.45;
  const photoCards = [
    { title: 'Switchyard & Control Room Civil Works', path: photo1Path, exists: hasPhoto1, x: 0.60 },
    { title: 'Solar Array Area & Transmission Line Route', path: photo2Path, exists: hasPhoto2, x: 4.65 },
    { title: 'Inverter & Transformer Foundation Yard', path: photo3Path, exists: hasPhoto3, x: 8.70 },
  ];

  photoCards.forEach(p => {
    // Card container
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: p.x,
      y: 1.05,
      w: photoW,
      h: photoH,
      rectRadius: 0.06,
      fill: { color: 'F1F5F9' },
      line: { color: colors.cardBorder, width: 1 },
    });

    if (p.exists) {
      slide4.addImage({
        path: p.path,
        x: p.x + 0.05,
        y: 1.10,
        w: photoW - 0.10,
        h: photoH - 0.45,
      });
      // Caption bar
      slide4.addShape(pptx.ShapeType.rect, {
        x: p.x + 0.05,
        y: 1.05 + photoH - 0.38,
        w: photoW - 0.10,
        h: 0.34,
        fill: { color: colors.navyBg },
      });
      slide4.addText(p.title, {
        x: p.x + 0.10,
        y: 1.05 + photoH - 0.38,
        w: photoW - 0.20,
        h: 0.34,
        fontSize: 7.2,
        bold: true,
        color: colors.white,
        valign: 'middle',
      });
    }
  });

  // Bottom Half: Next Two Weeks Look-Ahead Execution Plan (Y = 3.65" to 6.30", H = 2.60")
  const lY = 3.65;
  const lW = 11.80;
  const lH = 2.65;

  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 0.60,
    y: lY,
    w: lW,
    h: lH,
    rectRadius: 0.06,
    fill: { color: colors.cardBg },
    line: { color: colors.cardBorder, width: 1 },
  });

  slide4.addText('NEXT TWO WEEKS LOOK-AHEAD EXECUTION PLAN (14-DAY CRITICAL SCHEDULE)', {
    x: 0.75,
    y: lY + 0.10,
    w: lW - 0.30,
    h: 0.20,
    fontSize: 8.5,
    bold: true,
    color: colors.accentOrange,
  });

  // Look-Ahead Items from PPT1
  const lookAheadItems = [
    { task: 'Transmission Line work in progress', due: 'Due 10 Oct', tag: 'Critical Path', tagColor: colors.accentRed },
    { task: 'TAQC Inspection for PCVCB & Metering Panel (CP)', due: 'Due 12 Oct', tag: 'Critical Path', tagColor: colors.accentRed },
    { task: 'Excavation work for DC and AC cable trench', due: 'Due 13 Oct', tag: 'Civil Works', tagColor: colors.accentBlue },
    { task: 'Foundation of Inverter, Transformer, HT panel (CP) work in progress', due: 'Due 15 Oct', tag: 'Critical Path', tagColor: colors.accentRed },
    { task: 'Inverter delivery', due: 'Start 17 Oct', tag: 'Procurement', tagColor: colors.accentAmber },
    { task: 'Cable inspection is going delivery by 22nd Oct', due: 'Starts 22 Oct', tag: 'Inspection FAT', tagColor: colors.accentBlue },
    { task: 'Switchyard & Pile Casting completion', due: 'Due 28 Oct', tag: 'Milestone Gate', tagColor: colors.accentGreen },
  ];

  const laRowH = 0.29;
  const laStartY = lY + 0.36;

  lookAheadItems.forEach((item, idx) => {
    const iy = laStartY + idx * laRowH;
    // Row zebra background
    if (idx % 2 === 1) {
      slide4.addShape(pptx.ShapeType.rect, {
        x: 0.70,
        y: iy - 0.02,
        w: lW - 0.20,
        h: laRowH,
        fill: { color: colors.white },
      });
    }

    // Bullet icon
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 0.80,
      y: iy + 0.06,
      w: 0.12,
      h: 0.12,
      rectRadius: 0.06,
      fill: { color: item.tagColor },
    });

    // Task name
    slide4.addText(item.task, {
      x: 1.05,
      y: iy,
      w: 7.80,
      h: laRowH - 0.04,
      fontSize: 7.8,
      bold: true,
      color: colors.textDark,
    });

    // Tag badge
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 9.00,
      y: iy + 0.03,
      w: 1.60,
      h: 0.20,
      rectRadius: 0.04,
      fill: { color: 'F1F5F9' },
      line: { color: colors.cardBorder, width: 0.5 },
    });
    slide4.addText(item.tag, {
      x: 9.00,
      y: iy + 0.03,
      w: 1.60,
      h: 0.20,
      fontSize: 6.8,
      bold: true,
      align: 'center',
      valign: 'middle',
      color: item.tagColor,
    });

    // Due date
    slide4.addText(item.due, {
      x: 10.75,
      y: iy,
      w: 1.50,
      h: laRowH - 0.04,
      fontSize: 7.8,
      bold: true,
      align: 'right',
      color: colors.textDark,
    });
  });

  // ==========================================
  // SLIDE 5: RISKS AND CLIENT ACTIONS
  // ==========================================
  const slide5 = pptx.addSlide();
  slide5.background = { color: colors.white };
  addSlideHeader(slide5, 'Risks and Client Actions', 5);

  // Left Column: Project Risks (X = 0.60", W = 5.65", Y = 1.05" to 6.30")
  const rL = 0.60;
  const rW = 5.65;
  const rH = 5.25;

  slide5.addShape(pptx.ShapeType.roundRect, {
    x: rL,
    y: 1.05,
    w: rW,
    h: rH,
    rectRadius: 0.06,
    fill: { color: colors.cardBg },
    line: { color: colors.cardBorder, width: 1 },
  });

  slide5.addText('PROJECT RISKS & BOTTLENECK ITEMS', {
    x: rL + 0.20,
    y: 1.20,
    w: rW - 0.40,
    h: 0.22,
    fontSize: 9.0,
    bold: true,
    color: colors.accentOrange,
  });

  // Risk Card 1: GO Name Transfer / Change
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: rL + 0.20,
    y: 1.55,
    w: rW - 0.40,
    h: 2.10,
    rectRadius: 0.06,
    fill: { color: colors.white },
    line: { color: colors.cardBorder, width: 1 },
  });

  slide5.addText('GO Name Transfer / Change', {
    x: rL + 0.40,
    y: 1.70,
    w: 3.60,
    h: 0.26,
    fontSize: 10.5,
    bold: true,
    color: colors.textDark,
  });

  // Status Badge: Open
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: rL + rW - 1.50,
    y: 1.70,
    w: 0.90,
    h: 0.26,
    rectRadius: 0.04,
    fill: { color: 'FEF3C7' },
    line: { color: 'F59E0B', width: 1 },
  });
  slide5.addText('OPEN', {
    x: rL + rW - 1.50,
    y: 1.70,
    w: 0.90,
    h: 0.26,
    fontSize: 8.0,
    bold: true,
    align: 'center',
    valign: 'middle',
    color: 'B45309',
  });

  slide5.addText('Description & Current Status:', {
    x: rL + 0.40,
    y: 2.05,
    w: rW - 0.80,
    h: 0.20,
    fontSize: 8.0,
    bold: true,
    color: colors.textMuted,
  });
  slide5.addText('Awaiting Shareholding Agreement from Swelect.', {
    x: rL + 0.40,
    y: 2.25,
    w: rW - 0.80,
    h: 0.35,
    fontSize: 8.5,
    color: colors.textDark,
  });

  slide5.addText('Potential Project Impact:', {
    x: rL + 0.40,
    y: 2.65,
    w: rW - 0.80,
    h: 0.20,
    fontSize: 8.0,
    bold: true,
    color: colors.accentRed,
  });
  slide5.addText('Can affect the statutory approval timelines and COD synchronization schedule.', {
    x: rL + 0.40,
    y: 2.85,
    w: rW - 0.80,
    h: 0.35,
    fontSize: 8.5,
    color: colors.textDark,
  });

  slide5.addText('Mitigation Strategy:', {
    x: rL + 0.40,
    y: 3.20,
    w: rW - 0.80,
    h: 0.20,
    fontSize: 8.0,
    bold: true,
    color: colors.accentBlue,
  });
  slide5.addText('Dexler liaison team actively coordinating with Swelect legal team to expedite draft execution.', {
    x: rL + 0.40,
    y: 3.38,
    w: rW - 0.80,
    h: 0.20,
    fontSize: 7.8,
    color: colors.textMuted,
  });

  // Secondary Risk / Note Card
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: rL + 0.20,
    y: 3.80,
    w: rW - 0.40,
    h: 1.85,
    rectRadius: 0.06,
    fill: { color: colors.white },
    line: { color: colors.cardBorder, width: 1 },
  });

  slide5.addText('Transmission Line RoW & Bay Synchronization', {
    x: rL + 0.40,
    y: 3.95,
    w: 3.60,
    h: 0.26,
    fontSize: 10.0,
    bold: true,
    color: colors.textDark,
  });

  slide5.addShape(pptx.ShapeType.roundRect, {
    x: rL + rW - 1.70,
    y: 3.95,
    w: 1.10,
    h: 0.26,
    rectRadius: 0.04,
    fill: { color: 'DBEAFE' },
    line: { color: colors.accentBlue, width: 1 },
  });
  slide5.addText('CRITICAL PATH', {
    x: rL + rW - 1.70,
    y: 3.95,
    w: 1.10,
    h: 0.26,
    fontSize: 7.2,
    bold: true,
    align: 'center',
    valign: 'middle',
    color: colors.accentBlue,
  });

  slide5.addText('Right of Way clearance and Bay work payment sanctions are tracked daily to maintain target COD alignment.', {
    x: rL + 0.40,
    y: 4.30,
    w: rW - 0.80,
    h: 0.50,
    fontSize: 8.2,
    color: colors.textDark,
  });

  slide5.addText('Client points of contact: Dexler Project Delivery team.', {
    x: rL + 0.40,
    y: 5.20,
    w: rW - 0.80,
    h: 0.25,
    fontSize: 8.0,
    italic: true,
    color: colors.textMuted,
  });

  // Right Column: WHAT WE NEED FROM YOU (CLIENT ACTIONS & ESCALATIONS)
  const cL = 6.75;
  const cW = 5.65;

  slide5.addShape(pptx.ShapeType.roundRect, {
    x: cL,
    y: 1.05,
    w: cW,
    h: rH,
    rectRadius: 0.06,
    fill: { color: colors.cardBg },
    line: { color: colors.cardBorder, width: 1 },
  });

  slide5.addText('WHAT WE NEED FROM YOU (CLIENT ACTIONS)', {
    x: cL + 0.20,
    y: 1.20,
    w: cW - 0.40,
    h: 0.22,
    fontSize: 9.0,
    bold: true,
    color: colors.accentOrange,
  });

  // Escalation Card 1
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: cL + 0.20,
    y: 1.55,
    w: cW - 0.40,
    h: 1.85,
    rectRadius: 0.06,
    fill: { color: 'FFFBEB' },
    line: { color: 'F59E0B', width: 1.2 },
  });

  slide5.addText('ACTION ITEM 1: Share Holding Agreement Execution', {
    x: cL + 0.40,
    y: 1.70,
    w: cW - 0.80,
    h: 0.26,
    fontSize: 9.5,
    bold: true,
    color: '92400E',
  });

  slide5.addText('Awaiting Share Holding Agreement from Swelect Management.', {
    x: cL + 0.40,
    y: 2.05,
    w: cW - 0.80,
    h: 0.35,
    fontSize: 8.5,
    bold: true,
    color: colors.textDark,
  });

  slide5.addText('Urgency / Critical Dependency:', {
    x: cL + 0.40,
    y: 2.45,
    w: cW - 0.80,
    h: 0.18,
    fontSize: 7.8,
    bold: true,
    color: colors.accentRed,
  });

  slide5.addText('This agreement is the primary prerequisite for Government Order (GO) Name Transfer sanction. Without this document, statutory evacuation clearance cannot proceed.', {
    x: cL + 0.40,
    y: 2.65,
    w: cW - 0.80,
    h: 0.65,
    fontSize: 8.0,
    color: colors.textDark,
  });

  // Escalation Card 2
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: cL + 0.20,
    y: 3.55,
    w: cW - 0.40,
    h: 1.85,
    rectRadius: 0.06,
    fill: { color: 'FFFBEB' },
    line: { color: 'F59E0B', width: 1.2 },
  });

  slide5.addText('ACTION ITEM 2: Commercial Payment Clearance', {
    x: cL + 0.40,
    y: 3.70,
    w: cW - 0.80,
    h: 0.26,
    fontSize: 9.5,
    bold: true,
    color: '92400E',
  });

  slide5.addText('Request for 25% payment towards other Class 1 materials and construction materials.', {
    x: cL + 0.40,
    y: 4.05,
    w: cW - 0.80,
    h: 0.45,
    fontSize: 8.5,
    bold: true,
    color: colors.textDark,
  });

  slide5.addText('Commercial Justification & Site Impact:', {
    x: cL + 0.40,
    y: 4.55,
    w: cW - 0.80,
    h: 0.18,
    fontSize: 7.8,
    bold: true,
    color: colors.accentOrange,
  });

  slide5.addText('Disbursement is required to release long-lead vendor dispatches (Inverter stations, Bay equipment, balance of system structural elements) to maintain schedule momentum.', {
    x: cL + 0.40,
    y: 4.75,
    w: cW - 0.80,
    h: 0.55,
    fontSize: 8.0,
    color: colors.textDark,
  });

  // Footnote inside escalation box
  slide5.addText('Escalation Level: Immediate Executive Review · Requested by Dexler PMO', {
    x: cL + 0.40,
    y: 5.65,
    w: cW - 0.80,
    h: 0.22,
    fontSize: 7.2,
    italic: true,
    color: colors.textMuted,
  });

  // Save the modified presentation
  const outputPath = 'H:/weekly progress application/Swelect_Weekly_Project_Report_Week43_Aligned.pptx';
  await pptx.writeFile({ fileName: outputPath });
  console.log('Successfully written:', outputPath);
}

buildAlignedPresentation();
