import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { api } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';
import { toISODate } from '../utils/format.js';

const TransactionContext = createContext(null);

// Owns the transaction list, backed by the MongoDB API. Loads the signed-in
// user's transactions on login and routes every mutation through the server so
// data is persisted in the database (not the browser).
export function TransactionProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the user's transactions whenever auth state flips to signed-in.
  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setTransactions([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await api.get('/transactions');
      setTransactions(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTransaction = useCallback(async (data) => {
    const payload = {
      amount: Number(data.amount),
      type: data.type,
      category: data.category || 'other',
      note: data.note?.trim() || '',
      date: data.date || toISODate(new Date()),
    };
    const created = await api.post('/transactions', payload);
    setTransactions((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTransaction = useCallback(async (id, data) => {
    const updated = await api.put(`/transactions/${id}`, data);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    await api.del(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    await api.del('/transactions');
    setTransactions([]);
  }, []);

  // Replace the whole set (used by JSON restore) via a single bulk request.
  const replaceAll = useCallback(async (list) => {
    const inserted = await api.post('/transactions/bulk', { transactions: list });
    setTransactions(Array.isArray(inserted) ? inserted : []);
  }, []);

  // Newest first, by date.
  const sorted = useMemo(
    () => [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [transactions]
  );

  const value = useMemo(
    () => ({
      transactions: sorted,
      loading,
      error,
      refresh,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearAll,
      replaceAll,
    }),
    [sorted, loading, error, refresh, addTransaction, updateTransaction, deleteTransaction, clearAll, replaceAll]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

// Hook for consuming transaction state + actions.
export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return ctx;
}
