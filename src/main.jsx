import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import './index.css';
import App from './App.jsx';
import { ThemeModeProvider } from './theme/ThemeContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { TransactionProvider } from './context/TransactionContext.jsx';

// Application bootstrap: wires global providers (theme, auth, routing, data,
// dates). AuthProvider wraps TransactionProvider so data loads per signed-in user.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <CurrencyProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BrowserRouter>
            <AuthProvider>
              <TransactionProvider>
                <App />
              </TransactionProvider>
            </AuthProvider>
          </BrowserRouter>
        </LocalizationProvider>
      </CurrencyProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);
