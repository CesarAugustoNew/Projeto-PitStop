import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './admin.css';


export const AdminDashboard = () => {
  const [resultado, setResultado] = useState(null);
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    carregarResultado(data);
  }, [data]);

  const carregarResultado = async (dataConsulta) => {
    setLoading(true);
    try {
      const resposta = await api.dashboard.resultadoDoDia(dataConsulta);
      setResultado(resposta);
    } catch (err) {
      showToast(err.message || 'Erro ao carregar o resultado do dia.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatarPreco = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <div className="container">
      <div className="page-header admin-page-header">
        <div>
          <h2 className="page-title">Resultado do Dia</h2>
          <p className="page-subtitle">Acompanhe as ordens de serviço e o faturamento do lava-rápido</p>
        </div>

        <div className="admin-filter-row">
          <input
            type="date"
            className="form-control admin-date-input"
            value={data}
            max={hoje}
            onChange={(e) => setData(e.target.value)}
          />
          <button onClick={() => carregarResultado(data)} className="btn btn-secondary admin-reload-btn">
            Atualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Carregando resultado do dia...</div>
      ) : resultado ? (
        <>
          <div className="stats-grid">
            <div className="glass stat-card stat-card--primary">
              <span className="stat-label">Ordens no Dia</span>
              <div className="stat-value">{resultado.totalOrdens}</div>
            </div>
            <div className="glass stat-card stat-card--success">
              <span className="stat-label">Faturamento do Dia</span>
              <div className="stat-value">{formatarPreco(resultado.faturamentoTotal)}</div>
            </div>
            <div className="glass stat-card stat-card--secondary">
              <span className="stat-label">Recebidos</span>
              <div className="stat-value">{resultado.totalRecebidas}</div>
            </div>
            <div className="glass stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <span className="stat-label">Em Lavagem</span>
              <div className="stat-value">{resultado.totalEmLavagem}</div>
            </div>
            <div className="glass stat-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
              <span className="stat-label">Finalizados</span>
              <div className="stat-value">{resultado.totalFinalizadas}</div>
            </div>
            <div className="glass stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
              <span className="stat-label">Entregues</span>
              <div className="stat-value">{resultado.totalEntregues}</div>
            </div>
          </div>

          <div className="glass admin-sales-card">
            <h3 className="admin-sales-title">Faturamento por Tipo de Serviço</h3>
            {resultado.porTipoServico && resultado.porTipoServico.length > 0 ? (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Tipo de Serviço</th>
                      <th className="table-cell-right">Quantidade</th>
                      <th className="table-cell-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.porTipoServico.map((item, index) => (
                      <tr key={index}>
                        <td className="table-cell-bold">{item.tipoServico}</td>
                        <td className="table-cell-right">{item.quantidade}</td>
                        <td className="table-cell-right table-cell-primary">{formatarPreco(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="admin-no-data">Nenhuma ordem de serviço registrada nesse dia.</p>
            )}
          </div>

          <div className="admin-shortcuts">
            <Link to="/admin/carros" className="admin-shortcut-link">
              <div className="glass glass-hover admin-shortcut-card">
                <h4 className="admin-shortcut-title" style={{ color: 'var(--primary)' }}>Cadastrar Veículo</h4>
                <p className="admin-shortcut-desc">Registre carros dos clientes que chegam para lavagem.</p>
              </div>
            </Link>
            <Link to="/admin/funcionarios" className="admin-shortcut-link">
              <div className="glass glass-hover admin-shortcut-card">
                <h4 className="admin-shortcut-title" style={{ color: 'var(--secondary)' }}>Cadastrar Funcionário</h4>
                <p className="admin-shortcut-desc">Crie contas de acesso para a equipe do lava-rápido.</p>
              </div>
            </Link>
          </div>
        </>
      ) : (
        <div className="admin-no-stats">Sem dados para o dia selecionado.</div>
      )}
    </div>
  );
};

export default AdminDashboard;
