import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = auth.currentUser;

  // Always redirect to welcome if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 