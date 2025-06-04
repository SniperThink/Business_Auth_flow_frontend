import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import AuthPage from './components/AuthPage';
import BuyerDashboard from './pages/Buyer/BuyerDashboard';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import Dashboard from './pages/Dashboard';
import Unauthorized from './services/Unauthorized';

import ProtectedRoute from './services/ProtectedRoute';
import PublicRoute from './services/PublicRoute';

import { AuthProvider } from './contexts/AuthContext';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


export default function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route wrapped with PublicRoute */}
          <Route
            path="/"
            element={
              <PublicRoute>       
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute roles={['buyer_admin']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute roles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['buyer_admin', 'employee']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized page like if you created page just for testing*/ }
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Optional: 404 redirect */}
          <Route path="*" element={<PublicRoute><AuthPage /></PublicRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
