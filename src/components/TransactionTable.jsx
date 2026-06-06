import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Typography,
  Stack,
  Box,
  Tooltip,
} from '@mui/material';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { useState } from 'react';
import { getCategory } from '../utils/categories.js';
import { formatCurrency, formatShortDate } from '../utils/format.js';

// Paginated, responsive table of transactions with edit/delete row actions.
export default function TransactionTable({ transactions, onEdit, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const start = page * rowsPerPage;
  const paged = transactions.slice(start, start + rowsPerPage);

  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((t) => {
              const cat = getCategory(t.category);
              const Icon = cat.icon;
              const isIncome = t.type === 'income';
              return (
                <TableRow key={t.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1.5,
                          display: 'grid',
                          placeItems: 'center',
                          color: cat.color,
                          bgcolor: `color-mix(in srgb, ${cat.color} 16%, transparent)`,
                        }}
                      >
                        <Icon fontSize="small" />
                      </Box>
                      <Typography variant="body2">{cat.label}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 240 }}>
                      {t.note || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatShortDate(t.date)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={isIncome ? 'Income' : 'Expense'}
                      color={isIncome ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="subtitle2"
                      sx={{ color: isIncome ? 'success.main' : 'error.main', whiteSpace: 'nowrap' }}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => onEdit(t)}>
                        <EditOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => onDelete(t)} color="error">
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={transactions.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
}
