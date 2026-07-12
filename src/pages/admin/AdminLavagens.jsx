import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './admin.css';

/*
  Esta era a peça que faltava: sem uma tela para abrir uma "ordem de
  serviço" (escolher o veículo + o tipo de lavagem), nenhuma lavagem
  era registrada de verdade — por isso o dashboard sempre mostrava 0.

  Aqui o funcionário/admin:
    1) escolhe um veículo já cadastrado (o cliente vem junto, pelo
       veículo, sem precisar selecionar separado);
    2) escolhe o tipo de serviço e o valor;
    3) depois acompanha e atualiza o status (Recebido / Em Lavagem /
       Finalizado / Entregue) — ou seja, se o carro está "na espera"
       ou já "pronto".
*/

const TIPOS_SERVICO = [
  { value: 'LAVAGEM_SIMPLES', label: 'Lavagem Simples' },
  { value: 'LAVAGEM_COMPLETA', label: 'Lavagem Completa' },
  { value: 'HIGIENIZACAO', label: 'Higienização' },
  { value: 'POLIMENTO', label: 'Polimento' },
  { value: 'CRISTALIZACAO', label: 'Cristalização' },
];

const STATUS_ORDEM = [
  { value: 'RECEBIDO', label: 'Recebido (na espera)', badge: 'badge-primary' },
  { value: 'EM_LAVAGEM', label: 'Em Lavagem (na espera)', badge: 'badge-warning' },
  { value: 'FINALIZADO', label: 'Finalizado (pronto)', badge: 'badge-secondary' },
  { value: 'ENTREGUE', label: 'Entregue (pronto)', badge: 'badge-success' },
];

const tipoLabel = (valor) => TIPOS_SERVICO.find((t) => t.value === valor)?.label || valor;
const statusInfo = (valor) => STATUS_ORDEM.find((s) => s.value === valor) || { label: valor, badge: 'badge-primary' };

export const AdminLavagens = () => {
  const [ordens, setOrdens] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [veiculoId, setVeiculoId] = useState('');
  const [tipoServico, setTipoServico] = useState('LAVAGEM_SIMPLES');
  const [valor, setValor] = useState('');
  const [objetosValor, setObjetosValor] = useState('');

  const { showToast } = useToast();

  useEffect(() => { carregarTudo(); }, []);

  const carregarTudo = async () => {
    setLoading(true);
    try {
      const [ordensData, veiculosData] = await Promise.all([
        api.ordens.listar(),
        api.veiculos.listar(),
      ]);
      // Mais recentes primeiro
      setOrdens((ordensData || []).slice().reverse());
      setVeiculos(veiculosData || []);
    } catch (err) {
      showToast(err.message || 'Erro ao carregar as lavagens.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setVeiculoId(''); setTipoServico('LAVAGEM_SIMPLES'); setValor(''); setObjetosValor('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!veiculoId || !tipoServico || !valor) {
      showToast('Selecione o veículo, o tipo de serviço e informe o valor.', 'error');
      return;
    }

    const veiculo = veiculos.find((v) => v.id === veiculoId);
    if (!veiculo) {
      showToast('Veículo inválido.', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.ordens.criar({
        clienteId: veiculo.cliente.id,
        veiculoId,
        tipoServico,
        objetosValor,
        valor: Number(valor),
      });
      showToast('Lavagem registrada com sucesso!', 'success');
      setShowModal(false);
      carregarTudo();
    } catch (err) {
      showToast(err.message || 'Erro ao registrar a lavagem.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (ordem, novoStatus) => {
    try {
      await api.ordens.atualizarStatus(ordem.id, novoStatus);
      setOrdens((prev) => prev.map((o) => (o.id === ordem.id ? { ...o, status: novoStatus } : o)));
      showToast('Status atualizado!', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao atualizar o status.', 'error');
    }
  };

  const handleDelete = async (ordem) => {
    if (!window.confirm(`Remover esta lavagem (${ordem.veiculo?.placa})?`)) return;
    try {
      await api.ordens.deletar(ordem.id);
      showToast('Lavagem removida com sucesso!', 'success');
      setOrdens((prev) => prev.filter((o) => o.id !== ordem.id));
    } catch (err) {
      showToast(err.message || 'Erro ao remover a lavagem.', 'error');
    }
  };

  const formatarPreco = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const formatarData = (iso) =>
    iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Lavagens</h2>
          <p className="page-subtitle">Registre uma lavagem e acompanhe se o carro está na espera ou pronto</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" disabled={loading || veiculos.length === 0}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Registrar Lavagem
        </button>
      </div>

      {!loading && veiculos.length === 0 && (
        <div className="glass admin-empty">
          <h3>Nenhum veículo cadastrado ainda</h3>
          <p>Cadastre um veículo primeiro para poder registrar uma lavagem.</p>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Carregando lavagens...</div>
      ) : ordens.length > 0 ? (
        <div className="glass admin-table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Cliente</th>
                  <th>Tipo de Serviço</th>
                  <th>Entrada</th>
                  <th className="table-cell-right">Valor</th>
                  <th>Status</th>
                  <th className="table-cell-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ordens.map((ordem) => (
                  <tr key={ordem.id}>
                    <td className="table-cell-bold">{ordem.veiculo?.placa}</td>
                    <td>{ordem.cliente?.nome}</td>
                    <td>{tipoLabel(ordem.tipoServico)}</td>
                    <td>{formatarData(ordem.dataEntrada)}</td>
                    <td className="table-cell-right table-cell-primary">{formatarPreco(ordem.valor)}</td>
                    <td>
                      <select
                        className={`badge admin-status-select ${statusInfo(ordem.status).badge}`}
                        value={ordem.status}
                        onChange={(e) => handleStatusChange(ordem, e.target.value)}
                      >
                        {STATUS_ORDEM.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="table-cell-right">
                      <button onClick={() => handleDelete(ordem)} className="btn btn-danger admin-btn-sm">
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
        veiculos.length > 0 && (
          <div className="glass admin-empty">
            <h3>Nenhuma lavagem registrada ainda</h3>
            <p>É por isso que o dashboard mostra 0 — registre a primeira lavagem para começar.</p>
            <button onClick={openAddModal} className="btn btn-primary">Registrar Lavagem</button>
          </div>
        )
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h3 className="modal-title">Registrar Lavagem</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="lav-veiculo">Veículo *</label>
                <select id="lav-veiculo" className="form-control" value={veiculoId}
                  onChange={(e) => setVeiculoId(e.target.value)} required disabled={saving}>
                  <option value="">Selecione o veículo...</option>
                  {veiculos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.placa} — {v.modelo} ({v.cliente?.nome})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-2col">
                <div className="form-group">
                  <label htmlFor="lav-tipo">Tipo de Serviço *</label>
                  <select id="lav-tipo" className="form-control" value={tipoServico}
                    onChange={(e) => setTipoServico(e.target.value)} required disabled={saving}>
                    {TIPOS_SERVICO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="lav-valor">Valor (R$) *</label>
                  <input id="lav-valor" type="number" min="0" step="0.01" className="form-control" placeholder="Ex: 50.00"
                    value={valor} onChange={(e) => setValor(e.target.value)} required disabled={saving} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lav-objetos">Objetos de valor no veículo</label>
                <input id="lav-objetos" type="text" className="form-control" placeholder="Ex: óculos de sol no porta-luvas (opcional)"
                  value={objetosValor} onChange={(e) => setObjetosValor(e.target.value)} disabled={saving} />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" disabled={saving}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Registrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLavagens;
