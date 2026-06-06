import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { CURRENCIES, DEFAULT_CURRENCY, getCurrency } from '../utils/currencies.js';
import { setActiveCurrency } from '../utils/format.js';

const STORAGE_KEY = 'moneyflow:currency';

const CurrencyContext = createContext({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  symbol: '$',
  currencies: CURRENCIES,
});

function readStored() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return getCurrency(stored).code;
}

// Provides the active display currency and a setter. The choice is persisted so
// it survives reloads, and the module-level formatter (utils/format.js) is kept
// in sync so every formatCurrency call reflects the selection.
export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    const code = readStored();
    setActiveCurrency(code);
    return code;
  });

  const setCurrency = useCallback((code) => {
    const next = getCurrency(code).code;
    setActiveCurrency(next);
    localStorage.setItem(STORAGE_KEY, next);
    setCurrencyState(next);
  }, []);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      symbol: getCurrency(currency).symbol,
      currencies: CURRENCIES,
    }),
    [currency, setCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

// Convenience hook for reading/changing the active currency anywhere in the tree.
export function useCurrency() {
  return useContext(CurrencyContext);
}
