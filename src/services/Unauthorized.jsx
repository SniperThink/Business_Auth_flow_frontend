import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Unauthorized() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  switch (user.role) {
    case 'buyer_admin':
      return <Navigate to="/buyer-dashboard" replace />;
    case 'employee':
      return <Navigate to="/employee-dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
