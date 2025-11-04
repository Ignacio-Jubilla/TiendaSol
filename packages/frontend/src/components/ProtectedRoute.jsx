import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth(); // Asumo que tu AuthContext provee 'user' y 'isLoading'
  // 2. Si no está autenticado, redirige a Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.tipo)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;