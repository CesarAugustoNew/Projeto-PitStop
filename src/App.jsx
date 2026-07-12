import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFuncionarios from './pages/admin/AdminFuncionarios';
import AdminCarros from './pages/admin/AdminCarros';
import AdminLavagens from './pages/admin/AdminLavagens';
import AdminClientes from './pages/admin/AdminClientes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Dashboard do resultado do dia — só ADMIN vê */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Cadastro de funcionário — só ADMIN cria contas */}
                <Route
                  path="/admin/funcionarios"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminFuncionarios />
                    </ProtectedRoute>
                  }
                />

                {/* Cadastro de veículos — ADMIN e FUNCIONARIO usam no dia a dia */}
                <Route
                  path="/admin/carros"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FUNCIONARIO']}>
                      <AdminCarros />
                    </ProtectedRoute>
                  }
                />

                {/* Registrar/acompanhar lavagens — ADMIN e FUNCIONARIO usam no dia a dia */}
                <Route
                  path="/admin/lavagens"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FUNCIONARIO']}>
                      <AdminLavagens />
                    </ProtectedRoute>
                  }
                />

                {/* Cadastro de clientes — ADMIN e FUNCIONARIO usam no dia a dia */}
                <Route
                  path="/admin/clientes"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FUNCIONARIO']}>
                      <AdminClientes />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Home />} />
              </Routes>
            </div>

            <footer style={{
              textAlign: 'center',
              padding: '1.5rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              marginTop: 'auto'
            }}>
              &copy; {new Date().getFullYear()} PitStop Clean Car. Todos os direitos reservados.
            </footer>
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
