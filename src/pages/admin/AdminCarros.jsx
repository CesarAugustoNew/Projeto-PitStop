import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './admin.css';

/*
  Cadastro de veículos do lava-rápido. ADMIN e FUNCIONARIO acessam
  esta tela (ver App.jsx e SecurityConfig do back-end).

  Todo veículo pertence a um cliente já cadastrado. Como ainda não
  existe uma tela dedicada de clientes, este componente também
  permite cadastrar um cliente rapidamente (modal secundário) sem
  sair da tela de veículos.
*/
export const AdminCarros = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingCliente, setSavingCliente] = useState(false);

  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [clienteId, setClienteId] = useState('');

  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteEndereco, setClienteEndereco] = useState('');

  const { showToast } = useToast();

  useEffect(() => { carregarTudo(); }, []);

  const carregarTudo = async () => {
    setLoading(true);
    try {
      const [veiculosData, clientesData] = await Promise.all([
        api.veiculos.listar(),
        api.clientes.listar(),
      ]);
      setVeiculos(veiculosData || []);
      setClientes(clientesData || []);
    } catch (err) {
      showToast(err.message || 'Erro ao carregar veículos e clientes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setPlaca(''); setModelo(''); setMarca(''); setClienteId('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!placa || !modelo || !clienteId) {
      showToast('Preencha placa, modelo e selecione o cliente.', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.veiculos.criar({ placa, modelo, marca, clienteId });
      showToast('Veículo cadastrado com sucesso!', 'success');
      setShowModal(false);
      carregarTudo();
    } catch (err) {
      showToast(err.message || 'Erro ao cadastrar o veículo.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (veiculo) => {
    if (!window.confirm(`Remover o veículo "${veiculo.placa}"?`)) return;
    try {
      await api.veiculos.deletar(veiculo.id);
      showToast('Veículo removido com sucesso!', 'success');
      carregarTudo();
    } catch (err) {
      showToast(err.message || 'Erro ao remover o veículo.', 'error');
    }
  };

  const handleSaveCliente = async (e) => {
    e.preventDefault();
    if (!clienteNome || !clienteTelefone || !clienteEndereco) {
      showToast('Preencha todos os dados do cliente.', 'error');
      return;
    }

    setSavingCliente(true);
    try {
      const novoCliente = await api.clientes.criar({
        nome: clienteNome,
        telefone: clienteTelefone,
        endereco: clienteEndereco,
      });
      showToast('Cliente cadastrado com sucesso!', 'success');
      setClientes((prev) => [...prev, novoCliente]);
      setClienteId(novoCliente.id);
      setShowClienteModal(false);
      setClienteNome(''); setClienteTelefone(''); setClienteEndereco('');
    } catch (err) {
      showToast(err.message || 'Erro ao cadastrar o cliente.', 'error');
    } finally {
      setSavingCliente(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Veículos</h2>
          <p className="page-subtitle">Cadastre os carros que chegam para lavagem</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" disabled={loading}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Cadastrar Veículo
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Carregando veículos...</div>
      ) : veiculos.length > 0 ? (
        <div className="glass admin-table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Marca</th>
                  <th>Cliente</th>
                  <th className="table-cell-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map((veiculo) => (
                  <tr key={veiculo.id}>
                    <td className="table-cell-bold">{veiculo.placa}</td>
                    <td>{veiculo.modelo}</td>
                    <td>{veiculo.marca || '—'}</td>
                    <td>{veiculo.cliente?.nome}</td>
                    <td className="table-cell-right">
                      <button onClick={() => handleDelete(veiculo)} className="btn btn-danger admin-btn-sm">
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
          <h3>Nenhum veículo cadastrado</h3>
          <p>Cadastre o primeiro veículo para começar a registrar lavagens.</p>
          <button onClick={openAddModal} className="btn btn-primary">Cadastrar Veículo</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h3 className="modal-title">Cadastrar Veículo</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-2col">
                <div className="form-group">
                  <label htmlFor="carro-placa">Placa *</label>
                  <input id="carro-placa" type="text" className="form-control" placeholder="ABC1D23"
                    value={placa} onChange={(e) => setPlaca(e.target.value.toUpperCase())} required disabled={saving} />
                </div>
                <div className="form-group">
                  <label htmlFor="carro-modelo">Modelo *</label>
                  <input id="carro-modelo" type="text" className="form-control" placeholder="Ex: Onix"
                    value={modelo} onChange={(e) => setModelo(e.target.value)} required disabled={saving} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="carro-marca">Marca</label>
                <input id="carro-marca" type="text" className="form-control" placeholder="Ex: Chevrolet"
                  value={marca} onChange={(e) => setMarca(e.target.value)} disabled={saving} />
              </div>

              <div className="form-group">
                <label htmlFor="carro-cliente">Cliente *</label>
                <div className="admin-filter-row">
                  <select id="carro-cliente" className="form-control" value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)} required disabled={saving} style={{ flex: 1 }}>
                    <option value="">Selecione um cliente...</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-secondary admin-btn-sm" onClick={() => setShowClienteModal(true)} disabled={saving}>
                    + Novo Cliente
                  </button>
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

      {showClienteModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h3 className="modal-title">Cadastrar Cliente</h3>
              <button onClick={() => setShowClienteModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSaveCliente}>
              <div className="form-group">
                <label htmlFor="cliente-nome">Nome *</label>
                <input id="cliente-nome" type="text" className="form-control" placeholder="Ex: João Pereira"
                  value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} required disabled={savingCliente} />
              </div>
              <div className="form-group">
                <label htmlFor="cliente-telefone">Telefone *</label>
                <input id="cliente-telefone" type="text" className="form-control" placeholder="(11) 91234-5678"
                  value={clienteTelefone} onChange={(e) => setClienteTelefone(e.target.value)} required disabled={savingCliente} />
              </div>
              <div className="form-group">
                <label htmlFor="cliente-endereco">Endereço *</label>
                <input id="cliente-endereco" type="text" className="form-control" placeholder="Rua, número, bairro"
                  value={clienteEndereco} onChange={(e) => setClienteEndereco(e.target.value)} required disabled={savingCliente} />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowClienteModal(false)} className="btn btn-secondary" disabled={savingCliente}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={savingCliente}>{savingCliente ? 'Salvando...' : 'Salvar Cliente'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarros;
