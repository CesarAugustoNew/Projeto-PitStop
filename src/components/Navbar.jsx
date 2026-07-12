import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg className="navbar-logo-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
          Pit<span>Stop</span>
        </Link>

        {user && (
          <div className="navbar-links">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Dashboard
            </Link>
            <Link to="/admin/carros" className={`nav-link ${isActive('/admin/carros')}`}>
              Veículos
            </Link>

            {isAdmin() && (
              <div className="navbar-admin-section">
                <span className="navbar-divider">|</span>
                <Link to="/admin/funcionarios" className={`nav-link navbar-admin-link ${isActive('/admin/funcionarios')}`}>
                  Funcionários
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="navbar-auth">
          {user ? (
            <div className="navbar-user-info">
              <div className="navbar-user-badge">
                <span className="navbar-user-name">{user.nome}</span>
                <span className="navbar-user-role">{user.cargo}</span>
              </div>
              <button onClick={handleLogout} className="navbar-logout-btn">
                Sair
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
