import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './admin.css';

/*
  Cadastro de contas de acesso (FUNCIONARIO ou ADMIN).
  Só ADMIN acessa esta tela (ver App.jsx e SecurityConfig do back-end:
  /api/usuarios/** exige ROLE_ADMIN).
*/
export const AdminFuncionarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('FUNCIONARIO');

  const { showToast } = useToast();

  useEffect(() => { carregarUsuarios(); }, []);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await api.usuarios.listar();
      setUsuarios(data || []);
    } catch (err) {
      showToast(err.message || 'Erro ao carregar a lista de funcionários.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setNome(''); setEmail(''); setSenha(''); setRole('FUNCIONARIO');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nome || !email || !senha) {
      showToast('Preencha nome, e-mail e senha.', 'error');
      return;
    }
    if (senha.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.usuarios.criar({ nome, email, senha, role });
      showToast('Funcionário cadastrado com sucesso!', 'success');
      setShowModal(false);
      carregarUsuarios();
    } catch (err) {
      showToast(err.message || 'Erro ao cadastrar o funcionário.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (usuario) => {
    if (!window.confirm(`Remover o acesso de "${usuario.nome}"?`)) return;
    try {
      await api.usuarios.deletar(usuario.id);
      showToast('Usuário removido com sucesso!', 'success');
      carregarUsuarios();
    } catch (err) {
      showToast(err.message || 'Erro ao remover o usuário.', 'error');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Funcionários</h2>
          <p className="page-subtitle">Cadastre e gerencie os acessos da equipe do lava-rápido</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Cadastrar Funcionário
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Carregando funcionários...</div>
      ) : usuarios.length > 0 ? (
        <div className="glass admin-table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Cargo</th>
                  <th className="table-cell-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="table-cell-bold">{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className={`badge ${usuario.role === 'ADMIN' ? 'badge-success' : 'badge-secondary'}`}>
                        {usuario.role}
                      </span>
                    </td>
                    <td className="table-cell-right">
                      <button onClick={() => handleDelete(usuario)} className="btn btn-danger admin-btn-sm">
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass admin-empty">
          <h3>Nenhum funcionário cadastrado</h3>
          <p>Cadastre o primeiro acesso da equipe do lava-rápido.</p>
          <button onClick={openAddModal} className="btn btn-primary">Cadastrar Funcionário</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h3 className="modal-title">Cadastrar Funcionário</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="func-nome">Nome *</label>
                <input id="func-nome" type="text" className="form-control" placeholder="Ex: Maria Silva"
                  value={nome} onChange={(e) => setNome(e.target.value)} required disabled={saving} />
              </div>

              <div className="form-group">
                <label htmlFor="func-email">E-mail *</label>
                <input id="func-email" type="email" className="form-control" placeholder="maria@pitstop.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required disabled={saving} />
              </div>

              <div className="form-2col">
                <div className="form-group">
                  <label htmlFor="func-senha">Senha *</label>
                  <input id="func-senha" type="password" className="form-control" placeholder="Mínimo 6 caracteres"
                    value={senha} onChange={(e) => setSenha(e.target.value)} required disabled={saving} />
                </div>
                <div className="form-group">
                  <label htmlFor="func-role">Cargo *</label>
                  <select id="func-role" className="form-control" value={role}
                    onChange={(e) => setRole(e.target.value)} disabled={saving}>
                    <option value="FUNCIONARIO">Funcionário</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" disabled={saving}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFuncionarios;
