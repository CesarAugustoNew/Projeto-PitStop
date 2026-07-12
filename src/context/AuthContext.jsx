import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Escuta o logout disparado de outro lugar (ex.: api.js num 401)
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  /*
    O PitStop não tem autocadastro: contas de FUNCIONARIO e ADMIN só
    são criadas por um ADMIN já logado (tela "Cadastrar Funcionário").
    Por isso aqui só existe login, não "register".

    A resposta do back-end é:
      { accessToken, usuario: { id, nome, email, role } }

    Mantemos "cargo" no objeto salvo localmente (em vez de "role")
    só para deixar explícito que é o campo usado em toda a interface
    (ProtectedRoute, Navbar etc.), meramente um apelido do "role" que
    vem da API.
  */
  const login = async (email, senha) => {
    const data = await api.auth.login(email, senha);

    localStorage.setItem('token', data.accessToken);

    const userData = {
      id: data.usuario.id,
      nome: data.usuario.nome,
      email: data.usuario.email,
      cargo: data.usuario.role,
    };
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => user && user.cargo === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
