import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './admin.css';

/*
  Tela própria de cadastro de clientes. Antes só existia um cadastro
  rápido embutido na tela de Veículos; agora clientes também podem
  ser criados, editados e removidos aqui, com sua própria listagem.
*/
export const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(null);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  const { showToast } = useToast();

  useEffect(() => { carregarClientes(); }, []);

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const data = await api.clientes.listar();
      setClientes(data || []);
    } catch (err) {
      showToast(err.message || 'Erro ao carregar os clientes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditando(null);
    setNome(''); setTelefone(''); setEndereco('');
    setShowModal(true);
  };

  const openEditModal = (cliente) => {
    setEditando(cliente);
    setNome(cliente.nome); setTelefone(cliente.telefone); setEndereco(cliente.endereco);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nome || !telefone || !endereco) {
      showToast('Preencha todos os campos.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editando) {
        await api.clientes.atualizar(editando.id, { nome, telefone, endereco });
        showToast('Cliente atualizado com sucesso!', 'success');
      } else {
        await api.clientes.criar({ nome, telefone, endereco });
        showToast('Cliente cadastrado com sucesso!', 'success');
      }
      setShowModal(false);
      carregarClientes();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar o cliente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cliente) => {
    if (!window.confirm(`Remover o cliente "${cliente.nome}"? Isso também pode afetar veículos e lavagens vinculados a ele.`)) return;
    try {
      await api.clientes.deletar(cliente.id);
      showToast('Cliente removido com sucesso!', 'success');
      setClientes((prev) => prev.filter((c) => c.id !== cliente.id));
    } catch (err) {
      showToast(err.message || 'Erro ao remover o cliente. Verifique se ele não possui veículos cadastrados.', 'error');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Clientes</h2>
          <p className="page-subtitle">Cadastre e gerencie os clientes do lava-rápido</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Cadastrar Cliente
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Carregando clientes...</div>
      ) : clientes.length > 0 ? (
        <div className="glass admin-table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th className="table-cell-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="table-cell-bold">{cliente.nome}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.endereco}</td>
                    <td className="table-cell-right">
                      <button onClick={() => openEditModal(cliente)} className="btn btn-secondary admin-btn-sm" style={{ marginRight: '0.5rem' }}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(cliente)} className="btn btn-danger admin-btn-sm">
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
          <h3>Nenhum cliente cadastrado</h3>
          <p>Cadastre o primeiro cliente para poder registrar veículos e lavagens.</p>
          <button onClick={openAddModal} className="btn btn-primary">Cadastrar Cliente</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h3 className="modal-title">{editando ? 'Editar Cliente' : 'Cadastrar Cliente'}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="cliente-nome">Nome *</label>
                <input id="cliente-nome" type="text" className="form-control" placeholder="Ex: João Pereira"
                  value={nome} onChange={(e) => setNome(e.target.value)} required disabled={saving} />
              </div>
              <div className="form-group">
                <label htmlFor="cliente-telefone">Telefone *</label>
                <input id="cliente-telefone" type="text" className="form-control" placeholder="(11) 91234-5678"
                  value={telefone} onChange={(e) => setTelefone(e.target.value)} required disabled={saving} />
              </div>
              <div className="form-group">
                <label htmlFor="cliente-endereco">Endereço *</label>
                <input id="cliente-endereco" type="text" className="form-control" placeholder="Rua, número, bairro"
                  value={endereco} onChange={(e) => setEndereco(e.target.value)} required disabled={saving} />
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

export default AdminClientes;
