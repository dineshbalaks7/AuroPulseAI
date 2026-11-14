import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data array to CSV file
 */
export const exportToCSV = (data, filename = 'predictive_maintenance_export.csv') => {
  if (!data || !data.length) {
    alert('No data available to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Header row
  csvRows.push(headers.join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const loadImageAsBase64 = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          width: canvas.width,
          height: canvas.height,
        });
      } catch (err) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

/**
 * Generate and download a formatted PDF Report with optional embedded EDA & prediction figures
 */
export const exportToPDF = async ({
  title = 'Predictive Maintenance Report',
  subtitle = 'NASA C-MAPSS Turbofan Engine Fleet Assessment',
  dataset = 'FD001',
  summary = {},
  tableHeaders = [],
  tableData = [],
  figures = [],
  filename = 'predictive_maintenance_report.pdf',
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Primary Theme Color: #087F78
  const primaryColor = [8, 127, 120];
  const darkTextColor = [23, 43, 58];
  const mutedTextColor = [100, 116, 139];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AEROPULSE AI — PREDICTIVE MAINTENANCE SYSTEM', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()} | Dataset: ${dataset} | Model: XGBoost`, 14, 18);

  // Document Title
  doc.setTextColor(...darkTextColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 36);

  doc.setTextColor(...mutedTextColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 14, 43);

  // KPI Summary Box
  let currentY = 50;
  if (Object.keys(summary).length > 0) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, 182, 24, 2, 2, 'FD');

    const summaryEntries = Object.entries(summary);
    const colWidth = 182 / Math.min(summaryEntries.length, 4);

    summaryEntries.slice(0, 4).forEach(([key, val], idx) => {
      const xPos = 18 + idx * colWidth;
      doc.setTextColor(...mutedTextColor);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(key.toUpperCase(), xPos, currentY + 8);

      doc.setTextColor(...darkTextColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(String(val), xPos, currentY + 18);
    });

    currentY += 32;
  }

  // Data Table
  if (tableHeaders.length > 0 && tableData.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      styles: {
        fontSize: 8.5,
        textColor: darkTextColor,
        cellPadding: 2.5,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 14, right: 14 },
    });
  }

  // Embed Figures if provided
  if (figures && figures.length > 0) {
    for (const fig of figures) {
      doc.addPage();
      
      // Page banner
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, 210, 18, 'F');
      doc.setTextColor(...primaryColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`EXHIBIT — ${fig.category.toUpperCase()}: ${fig.title}`, 14, 12);

      doc.setTextColor(...mutedTextColor);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(fig.desc || '', 14, 26);

      // Load image
      const imgObj = await loadImageAsBase64(fig.file);
      if (imgObj && imgObj.dataUrl) {
        const maxWidth = 182;
        const maxHeight = 210;
        const aspect = imgObj.width / imgObj.height;

        let renderWidth = maxWidth;
        let renderHeight = renderWidth / aspect;

        if (renderHeight > maxHeight) {
          renderHeight = maxHeight;
          renderWidth = renderHeight * aspect;
        }

        const renderX = 14 + (maxWidth - renderWidth) / 2;
        doc.addImage(imgObj.dataUrl, 'PNG', renderX, 32, renderWidth, renderHeight);
      }
    }
  }

  // Footer for all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...mutedTextColor);
    doc.text(
      `NASA C-MAPSS Turbofan Prognostics Platform | Page ${i} of ${pageCount}`,
      14,
      287
    );
  }

  doc.save(filename);
};
