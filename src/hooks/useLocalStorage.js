import { useState, useEffect, useCallback } from 'react';

// Generic localStorage-backed state hook. Behaves like useState but persists
// the value under `key` and keeps it in sync across tabs/windows.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be full or unavailable; fail silently to avoid crashing.
    }
  }, [key, value]);

  // Keep state consistent if the same key is changed in another browser tab.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === key && event.newValue !== null) {
        try {
          setValue(JSON.parse(event.newValue));
        } catch {
          // Ignore malformed external writes.
        }
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, reset];
}
