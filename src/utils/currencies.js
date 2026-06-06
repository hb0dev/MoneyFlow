// Supported display currencies. `code` is the ISO 4217 code passed to
// Intl.NumberFormat; `symbol` is a short glyph used for compact input adornments.
export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'DZD', label: 'Algerian Dinar', symbol: 'DA' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', label: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SAR', label: 'Saudi Riyal', symbol: 'SR' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'AED' },
  { code: 'MAD', label: 'Moroccan Dirham', symbol: 'DH' },
  { code: 'TND', label: 'Tunisian Dinar', symbol: 'DT' },
  { code: 'EGP', label: 'Egyptian Pound', symbol: 'E£' },
  { code: 'TRY', label: 'Turkish Lira', symbol: '₺' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
];

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));

export const DEFAULT_CURRENCY = 'USD';

// Look up a currency descriptor, falling back to USD for unknown codes.
export function getCurrency(code) {
  return BY_CODE.get(code) || BY_CODE.get(DEFAULT_CURRENCY);
}
