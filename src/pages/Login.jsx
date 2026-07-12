import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Login.css';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      showToast('Por favor, preencha todos os campos.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, senha);
      showToast('Login realizado com sucesso!', 'success');
      navigate('/');
    } catch (error) {
      showToast(error.message || 'E-mail ou senha inválidos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass">

        <div className="auth-header">
          <div className="auth-logo">
            Pit<span>Stop</span>
          </div>
          <p className="login-subtitle">Acesse o painel do lava-rápido</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="seuemail@pitstop.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="login-footnote">
          Não tem uma conta? Peça a um administrador para cadastrar seu acesso.
        </p>
      </div>
    </div>
  );
};

export default Login;
