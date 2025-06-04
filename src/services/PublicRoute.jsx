import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (user) {
    // Proper role-based redirection
    if (user.role === 'employee') {
      return <Navigate to="/employee-dashboard" replace />;
    } else if (user.role === 'buyer_admin') {
      return <Navigate to="/buyer-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
