import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { getCategory } from './categories.js';
import { formatCurrency, formatShortDate } from './format.js';
import { getTotals } from './stats.js';

// Export / import helpers: PDF, Excel, and JSON backup/restore. Kept free of
// React so they can be called from any handler.

// Trigger a browser download for an arbitrary Blob.
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export the given transactions to a styled PDF document with a summary header.
export function exportToPDF(transactions) {
  const doc = new jsPDF();
  const { income, expense, balance } = getTotals(transactions);

  doc.setFontSize(20);
  doc.setTextColor(22, 199, 132);
  doc.text('MoneyFlow', 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text('Transactions Report', 14, 26);
  doc.text(`Generated: ${formatShortDate(new Date())}`, 14, 32);

  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(`Total Income: ${formatCurrency(income)}`, 14, 42);
  doc.text(`Total Expenses: ${formatCurrency(expense)}`, 80, 42);
  doc.text(`Balance: ${formatCurrency(balance)}`, 150, 42);

  const rows = transactions.map((t) => [
    formatShortDate(t.date),
    t.type === 'income' ? 'Income' : 'Expense',
    getCategory(t.category).label,
    t.note || '-',
    `${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}`,
  ]);

  autoTable(doc, {
    startY: 48,
    head: [['Date', 'Type', 'Category', 'Note', 'Amount']],
    body: rows,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [18, 24, 33], textColor: [230, 237, 243] },
    alternateRowStyles: { fillColor: [244, 246, 249] },
    columnStyles: { 4: { halign: 'right' } },
  });

  doc.save(`moneyflow-report-${formatShortDate(new Date())}.pdf`);
}

// Export the given transactions to an .xlsx workbook.
export function exportToExcel(transactions) {
  const data = transactions.map((t) => ({
    Date: t.date,
    Type: t.type === 'income' ? 'Income' : 'Expense',
    Category: getCategory(t.category).label,
    Note: t.note || '',
    Amount: t.amount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 14 },
    { wch: 10 },
    { wch: 14 },
    { wch: 32 },
    { wch: 12 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  XLSX.writeFile(workbook, `moneyflow-transactions-${Date.now()}.xlsx`);
}

// Download a full JSON backup of the transaction set.
export function exportBackup(transactions) {
  const payload = {
    app: 'MoneyFlow',
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  downloadBlob(blob, `moneyflow-backup-${Date.now()}.json`);
}

// Parse a previously exported JSON backup file, returning the transactions
// array. Rejects if the file is malformed.
export function parseBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const list = Array.isArray(parsed)
          ? parsed
          : parsed.transactions;
        if (!Array.isArray(list)) {
          throw new Error('No transactions array found in file.');
        }
        resolve(list);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}
