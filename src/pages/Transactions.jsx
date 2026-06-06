import { useState, useMemo, useRef } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Stack,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Menu,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  SearchRounded,
  PictureAsPdfOutlined,
  GridOnOutlined,
  FileDownloadOutlined,
  FileUploadOutlined,
  DeleteSweepOutlined,
  ClearRounded,
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext.jsx';
import TransactionTable from '../components/TransactionTable.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { filterByDateRange } from '../utils/stats.js';
import {
  exportToPDF,
  exportToExcel,
  exportBackup,
  parseBackupFile,
} from '../utils/export.js';

// Transactions page: full searchable / filterable list with edit, delete,
// export (PDF / Excel), and JSON backup & restore.
export default function Transactions() {
  const { transactions, updateTransaction, deleteTransaction, clearAll, replaceAll } =
    useTransactions();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [clearOpen, setClearOpen] = useState(false);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  // Apply search + type + date-range filters in sequence.
  const filtered = useMemo(() => {
    let list = transactions;
    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter);
    list = filterByDateRange(list, startDate, endDate);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.note.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          String(t.amount).includes(q)
      );
    }
    return list;
  }, [transactions, typeFilter, startDate, endDate, search]);

  const hasFilters = search || typeFilter !== 'all' || startDate || endDate;

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setStartDate(null);
    setEndDate(null);
  };

  const handleExport = (kind) => {
    setExportAnchor(null);
    if (filtered.length === 0) {
      setToast({ severity: 'warning', msg: 'No transactions to export.' });
      return;
    }
    if (kind === 'pdf') exportToPDF(filtered);
    else exportToExcel(filtered);
  };

  const handleRestore = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const list = await parseBackupFile(file);
      await replaceAll(list);
      setToast({ severity: 'success', msg: `Restored ${list.length} transactions.` });
    } catch {
      setToast({ severity: 'error', msg: 'Could not restore from this file.' });
    }
  };

  return (
    <Box>
      {/* Toolbar */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search note, category, amount"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <DatePicker
                label="From"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <DatePicker
                label="To"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {filtered.length} of {transactions.length} transactions
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {hasFilters && (
                <Button size="small" color="inherit" startIcon={<ClearRounded />} onClick={resetFilters}>
                  Clear
                </Button>
              )}
              <Button
                size="small"
                variant="outlined"
                startIcon={<FileDownloadOutlined />}
                onClick={(e) => setExportAnchor(e.currentTarget)}
              >
                Export
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FileUploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
              >
                Restore
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepOutlined />}
                onClick={() => setClearOpen(true)}
              >
                Clear all
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          {filtered.length === 0 ? (
            <EmptyState
              title={hasFilters ? 'No matching transactions' : 'No transactions yet'}
              description={
                hasFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Add transactions from the dashboard to see them here.'
              }
            />
          ) : (
            <TransactionTable
              transactions={filtered}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          )}
        </CardContent>
      </Card>

      {/* Export menu */}
      <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)}>
        <MenuItem onClick={() => handleExport('pdf')}>
          <PictureAsPdfOutlined fontSize="small" style={{ marginRight: 8 }} /> Export to PDF
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>
          <GridOnOutlined fontSize="small" style={{ marginRight: 8 }} /> Export to Excel
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setExportAnchor(null);
            exportBackup(transactions);
          }}
        >
          <FileDownloadOutlined fontSize="small" style={{ marginRight: 8 }} /> Backup (JSON)
        </MenuItem>
      </Menu>

      {/* Hidden input for JSON restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleRestore}
      />

      {/* Edit dialog */}
      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mt: 1 }}>
            <TransactionForm
              initial={editing}
              submitLabel="Save Changes"
              onCancel={() => setEditing(null)}
              onSubmit={async (data) => {
                try {
                  await updateTransaction(editing.id, data);
                  setEditing(null);
                  setToast({ severity: 'success', msg: 'Transaction updated.' });
                } catch (err) {
                  setToast({ severity: 'error', msg: err.message || 'Update failed.' });
                }
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete transaction?"
        message="This transaction will be permanently removed."
        confirmLabel="Delete"
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          try {
            await deleteTransaction(deleting.id);
            setToast({ severity: 'success', msg: 'Transaction deleted.' });
          } catch (err) {
            setToast({ severity: 'error', msg: err.message || 'Delete failed.' });
          }
        }}
      />

      {/* Clear all confirm */}
      <ConfirmDialog
        open={clearOpen}
        title="Clear all transactions?"
        message="This permanently removes every transaction. Consider exporting a backup first."
        confirmLabel="Clear all"
        onClose={() => setClearOpen(false)}
        onConfirm={async () => {
          try {
            await clearAll();
            setToast({ severity: 'success', msg: 'All transactions cleared.' });
          } catch (err) {
            setToast({ severity: 'error', msg: err.message || 'Could not clear data.' });
          }
        }}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2800}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)}>
            {toast.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
