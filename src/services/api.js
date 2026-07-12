// =====================================================================
// ARQUIVO: src/services/api.js
// =====================================================================

/*
  Camada única de acesso à API do PitStop Clean Car.

  Centralizamos aqui todas as chamadas HTTP para o back-end, seguindo
  o mesmo padrão usado no projeto CineSenai: se o back-end mudar um
  endpoint, só precisamos alterar neste arquivo.
*/

// URL base da API.
// Localmente fica vazio para usar o proxy do Vite (ver vite.config.js).
const BASE_URL = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token
    ? { 'Authorization': `Bearer ${token}` }
    : {};
};

const request = async (url, options = {}) => {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(BASE_URL + url, {
    ...options,
    headers,
  });

  /*
    IMPORTANTE: 401 e 403 NÃO significam a mesma coisa.

    401 (Unauthorized) → o token é inválido, ausente ou expirou.
                          Aqui sim faz sentido derrubar a sessão.

    403 (Forbidden)    → o usuário ESTÁ autenticado, só não tem
                          permissão para aquela ação específica
                          (ex.: um FUNCIONARIO tentando uma rota
                          exclusiva de ADMIN). Isso NÃO deve deslogar
                          ninguém, só deve mostrar o erro.

    Por isso só limpamos o localStorage e desconectamos no 401.
  */
  if (response.status === 401) {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-change'));
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    /*
      O GlobalExceptionHandler do back-end devolve a mensagem de erro
      no campo "error" (ver GlobalExceptionHandler.java).
    */
    throw new Error(
      errorData.error || errorData.mensagem || errorData.message || `Erro na requisição (Status: ${response.status})`
    );
  }

  const texto = await response.text();
  return texto ? JSON.parse(texto) : null;
};

export const api = {

  // ===================================================================
  // AUTENTICAÇÃO
  // ===================================================================

  auth: {
    /*
      Login de ADMIN ou FUNCIONARIO.

      Método: POST
      URL: /api/auth/login
      Body: { email, senha }
      Retorna: { accessToken, usuario: { id, nome, email, role } }
    */
    login: (email, senha) =>
      request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      }),
  },

  // ===================================================================
  // USUÁRIOS (contas de ADMIN e FUNCIONARIO — somente ADMIN acessa)
  // ===================================================================

  usuarios: {
    listar: () => request('/api/usuarios'),
    buscarPorId: (id) => request(`/api/usuarios/${id}`),

    /*
      Cria uma conta de FUNCIONARIO ou ADMIN.
      Body: { nome, email, senha, role }
    */
    criar: (usuario) =>
      request('/api/usuarios', {
        method: 'POST',
        body: JSON.stringify(usuario),
      }),

    deletar: (id) =>
      request(`/api/usuarios/${id}`, { method: 'DELETE' }),
  },

  // ===================================================================
  // CLIENTES
  // ===================================================================

  clientes: {
    listar: () => request('/api/clientes'),
    buscarPorId: (id) => request(`/api/clientes/${id}`),

    criar: (cliente) =>
      request('/api/clientes', {
        method: 'POST',
        body: JSON.stringify(cliente),
      }),

    atualizar: (id, cliente) =>
      request(`/api/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cliente),
      }),

    deletar: (id) =>
      request(`/api/clientes/${id}`, { method: 'DELETE' }),
  },

  // ===================================================================
  // VEÍCULOS
  // ===================================================================

  veiculos: {
    /*
      Lista todos os veículos, ou filtra por cliente:
      api.veiculos.listar()                 -> todos
      api.veiculos.listar(clienteId)        -> só desse cliente
    */
    listar: (clienteId) =>
      request(clienteId ? `/api/veiculos?clienteId=${clienteId}` : '/api/veiculos'),

    buscarPorId: (id) => request(`/api/veiculos/${id}`),

    /*
      Body: { placa, modelo, marca, clienteId }
    */
    criar: (veiculo) =>
      request('/api/veiculos', {
        method: 'POST',
        body: JSON.stringify(veiculo),
      }),

    atualizar: (id, veiculo) =>
      request(`/api/veiculos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(veiculo),
      }),

    deletar: (id) =>
      request(`/api/veiculos/${id}`, { method: 'DELETE' }),
  },

  // ===================================================================
  // ORDENS DE SERVIÇO (lavagens)
  // ===================================================================

  ordens: {
    /*
      api.ordens.listar()               -> todas
      api.ordens.listar('EM_LAVAGEM')   -> só as de um status
    */
    listar: (status) =>
      request(status ? `/api/ordens?status=${status}` : '/api/ordens'),

    buscarPorId: (id) => request(`/api/ordens/${id}`),

    /*
      Abre uma nova lavagem (ordem de serviço).
      Body: { clienteId, veiculoId, tipoServico, objetosValor, valor }
      O funcionário responsável é sempre o usuário logado (o back-end
      extrai isso do token, não é enviado aqui).
    */
    criar: (ordem) =>
      request('/api/ordens', {
        method: 'POST',
        body: JSON.stringify(ordem),
      }),

    /*
      Avança/ajusta o status: RECEBIDO -> EM_LAVAGEM -> FINALIZADO -> ENTREGUE
    */
    atualizarStatus: (id, status) =>
      request(`/api/ordens/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),

    deletar: (id) =>
      request(`/api/ordens/${id}`, { method: 'DELETE' }),
  },

  // ===================================================================
  // DASHBOARD (resultado do dia)
  // ===================================================================

  dashboard: {
    /*
      api.dashboard.resultadoDoDia()             -> resultado de hoje
      api.dashboard.resultadoDoDia('2026-07-12') -> resultado de um dia específico
    */
    resultadoDoDia: (data) =>
      request(data ? `/api/dashboard?data=${data}` : '/api/dashboard'),
  },
};
