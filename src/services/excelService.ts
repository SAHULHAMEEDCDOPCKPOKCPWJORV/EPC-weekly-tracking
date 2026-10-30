import ExcelJS from 'exceljs';
import { Activity, Project, WeeklyReport } from '../types';

export const exportActivitiesToExcel = async (
  project: Project,
  report: WeeklyReport,
  activities: Activity[]
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = report.preparedBy || 'EPC Progress Manager';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(`Week ${report.weekNumber} Activities`, {
    views: [{ state: 'frozen', ySplit: 5 }],
  });

  // Project Header styling
  worksheet.mergeCells('A1:Q1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `${project.name} - Weekly Progress Schedule (Week ${report.weekNumber})`;
  titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F2A4A' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  worksheet.getRow(1).height = 30;

  worksheet.mergeCells('A2:Q2');
  const metaCell = worksheet.getCell('A2');
  metaCell.value = `Client: ${project.clientName} | Location: ${project.location} | Baseline COD: ${project.baselineCod} | Forecast COD: ${report.forecastCod || project.forecastCod} | Report Date: ${report.reportingDate}`;
  metaCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF334155' } };
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  metaCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  worksheet.getRow(2).height = 22;

  worksheet.mergeCells('A3:Q3');
  const kpiCell = worksheet.getCell('A3');
  kpiCell.value = `Overall Planned Progress: ${report.overallPlannedProgress}% | Overall Actual Progress: ${report.overallActualProgress}% | Weekly Achieved: ${report.weeklyActualProgress}% | Days to COD: ${report.daysToCod}`;
  kpiCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0066FF' } };
  kpiCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
  kpiCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  worksheet.getRow(3).height = 20;

  // Blank row
  worksheet.getRow(4).height = 10;

  // Table Column Headers (Row 5)
  const headers = [
    { header: 'WBS Code', key: 'wbsCode', width: 12 },
    { header: 'Activity ID', key: 'activityId', width: 14 },
    { header: 'Workstream', key: 'workstream', width: 18 },
    { header: 'Activity Name', key: 'name', width: 35 },
    { header: 'Responsible Person', key: 'responsiblePerson', width: 22 },
    { header: 'Planned Start', key: 'plannedStartDate', width: 14 },
    { header: 'Planned Finish', key: 'plannedFinishDate', width: 14 },
    { header: 'Actual Start', key: 'actualStartDate', width: 14 },
    { header: 'Actual Finish', key: 'actualFinishDate', width: 14 },
    { header: 'Weight (%)', key: 'weightage', width: 12 },
    { header: 'Prev Week %', key: 'prevWeekProgress', width: 14 },
    { header: 'Current Week %', key: 'currentWeekProgress', width: 15 },
    { header: 'Weekly Achieved %', key: 'weeklyAchieved', width: 17 },
    { header: 'Planned %', key: 'plannedProgress', width: 12 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Delay (Days)', key: 'delayDays', width: 13 },
    { header: 'Critical Path', key: 'isCriticalPath', width: 13 },
    { header: 'Remarks / Notes', key: 'remarks', width: 40 },
  ];

  worksheet.getRow(5).values = headers.map(h => h.header);
  worksheet.getRow(5).height = 26;
  worksheet.getRow(5).eachCell(cell => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Populate data
  activities.forEach((act, idx) => {
    const rowNumber = 6 + idx;
    const row = worksheet.getRow(rowNumber);
    row.values = [
      act.wbsCode,
      act.activityId,
      act.workstream,
      act.name,
      act.responsiblePerson,
      act.plannedStartDate,
      act.plannedFinishDate,
      act.actualStartDate,
      act.actualFinishDate,
      act.weightage,
      act.prevWeekProgress,
      act.currentWeekProgress,
      Math.max(0, act.currentWeekProgress - act.prevWeekProgress),
      act.plannedProgress,
      act.status,
      act.delayDays,
      act.isCriticalPath ? 'YES' : 'NO',
      act.remarks,
    ];

    row.height = 22;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Arial', size: 9.5 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };

      // Alignments & status highlights
      if ([1, 2, 6, 7, 8, 9, 15, 16, 17].includes(colNumber)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if ([10, 11, 12, 13, 14].includes(colNumber)) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }

      // Status color coding
      if (colNumber === 15) {
        if (cell.value === 'Completed') {
          cell.font = { color: { argb: 'FF10B981' }, bold: true };
        } else if (cell.value === 'Delayed') {
          cell.font = { color: { argb: 'FFEF4444' }, bold: true };
        } else if (cell.value === 'In Progress') {
          cell.font = { color: { argb: 'FF0066FF' }, bold: true };
        }
      }

      // Critical path highlight
      if (colNumber === 17 && cell.value === 'YES') {
        cell.font = { color: { argb: 'FFEF4444' }, bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF1F2' } };
      }
    });
  });

  // Set column widths
  headers.forEach((h, idx) => {
    worksheet.getColumn(idx + 1).width = h.width;
  });

  // Generate buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${project.clientName.replace(/\s+/g, '_')}_Week_${report.weekNumber}_Activities.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

export const parseActivitiesFromExcel = async (
  file: File,
  projectId: string
): Promise<Partial<Activity>[]> => {
  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error('No worksheet found in Excel file.');

  const importedActivities: Partial<Activity>[] = [];

  // Find header row (usually row 5 or row 1)
  let headerRowIndex = 5;
  for (let r = 1; r <= 10; r++) {
    const row = worksheet.getRow(r);
    const cellValue = String(row.getCell(1).value || '').toLowerCase();
    if (cellValue.includes('wbs') || cellValue.includes('activity')) {
      headerRowIndex = r;
      break;
    }
  }

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowIndex) return;

    const wbsCode = String(row.getCell(1).value || '').trim();
    const activityId = String(row.getCell(2).value || '').trim() || `ACT-${rowNumber}`;
    const workstream = String(row.getCell(3).value || 'General').trim();
    const name = String(row.getCell(4).value || '').trim();

    if (!name && !activityId) return;

    const responsiblePerson = String(row.getCell(5).value || '').trim();
    const plannedStartDate = String(row.getCell(6).value || '').trim();
    const plannedFinishDate = String(row.getCell(7).value || '').trim();
    const actualStartDate = String(row.getCell(8).value || '').trim();
    const actualFinishDate = String(row.getCell(9).value || '').trim();
    const weightage = parseFloat(String(row.getCell(10).value || '5')) || 5;
    const prevWeekProgress = parseFloat(String(row.getCell(11).value || '0')) || 0;
    const currentWeekProgress = parseFloat(String(row.getCell(12).value || '0')) || 0;
    const plannedProgress = parseFloat(String(row.getCell(14).value || '0')) || 0;
    const statusVal = String(row.getCell(15).value || '').trim();
    const delayDays = parseInt(String(row.getCell(16).value || '0'), 10) || 0;
    const cpVal = String(row.getCell(17).value || '').toUpperCase();
    const isCriticalPath = cpVal.includes('YES') || cpVal.includes('TRUE') || cpVal === 'CP';
    const remarks = String(row.getCell(18).value || '').trim();

    importedActivities.push({
      projectId,
      wbsCode: wbsCode || `1.${rowNumber}`,
      activityId,
      workstream,
      name: name || activityId,
      description: remarks || name,
      responsiblePerson,
      plannedStartDate: plannedStartDate || '2026-09-01',
      plannedFinishDate: plannedFinishDate || '2026-11-28',
      actualStartDate,
      actualFinishDate,
      weightage,
      prevWeekProgress,
      currentWeekProgress,
      weeklyAchieved: Math.max(0, currentWeekProgress - prevWeekProgress),
      plannedProgress,
      actualProgress: currentWeekProgress,
      status: (statusVal === 'Completed' || currentWeekProgress >= 100) ? 'Completed' : (delayDays > 0 ? 'Delayed' : 'In Progress'),
      delayDays,
      isCriticalPath,
      dependencies: [],
      isMilestone: false,
      remarks,
    });
  });

  return importedActivities;
};
