import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="protected-loading">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={isAdmin() ? '/admin' : '/admin/carros'} replace />;
};

export default Home;
