import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { FlightProvider } from './contexts/FlightContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FlightProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </FlightProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);