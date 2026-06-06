import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Button,
  Stack,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TrendingUpRounded, TrendingDownRounded, SaveRounded } from '@mui/icons-material';
import { CATEGORIES } from '../utils/categories.js';
import { toISODate } from '../utils/format.js';

// Default empty form state. Date defaults to today, satisfying the requirement
// that the date is auto-filled with the current date.
function emptyForm() {
  return {
    amount: '',
    type: 'expense',
    category: 'food',
    note: '',
    date: new Date(),
  };
}

// Shared add/edit form for a transaction. When `initial` is provided it behaves
// as an edit form; otherwise it is a quick-add form (used on the dashboard).
export default function TransactionForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        amount: String(initial.amount ?? ''),
        type: initial.type ?? 'expense',
        category: initial.category ?? 'other',
        note: initial.note ?? '',
        date: initial.date ? new Date(initial.date) : new Date(),
      });
    }
  }, [initial]);

  const setField = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }
    setError('');
    onSubmit({
      amount,
      type: form.type,
      category: form.category,
      note: form.note,
      date: toISODate(form.date),
    });
    if (!initial) setForm(emptyForm());
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <ToggleButtonGroup
          value={form.type}
          exclusive
          fullWidth
          onChange={(_, val) => val && setField('type')(val)}
          color={form.type === 'income' ? 'success' : 'error'}
        >
          <ToggleButton value="income">
            <TrendingUpRounded sx={{ mr: 1 }} fontSize="small" /> Income
          </ToggleButton>
          <ToggleButton value="expense">
            <TrendingDownRounded sx={{ mr: 1 }} fontSize="small" /> Expense
          </ToggleButton>
        </ToggleButtonGroup>

        <TextField
          label="Amount"
          value={form.amount}
          onChange={(e) => setField('amount')(e.target.value)}
          type="number"
          inputProps={{ min: 0, step: '0.01' }}
          error={Boolean(error)}
          helperText={error || ' '}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            label="Category"
            value={form.category}
            onChange={(e) => setField('category')(e.target.value)}
            fullWidth
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>

          <DatePicker
            label="Date"
            value={form.date}
            onChange={(val) => val && setField('date')(val)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Stack>

        <TextField
          label="Note (optional)"
          value={form.note}
          onChange={(e) => setField('note')(e.target.value)}
          fullWidth
          multiline
          minRows={1}
        />

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          {onCancel && (
            <Button onClick={onCancel} color="inherit">
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" startIcon={<SaveRounded />}>
            {submitLabel || 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
