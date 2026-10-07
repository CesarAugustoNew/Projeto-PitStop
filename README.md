# PitStop Clean Car — Gestão de Lava-Rápido

Aplicação Front-end desenvolvida em React para o gerenciamento de um lava-rápido, com o objetivo de substituir cadernos e planilhas por um painel único, que mostra quais carros estão na fila, quais já estão prontos e quanto o lava-rápido faturou no dia.

A aplicação reúne clientes, veículos, funcionários e ordens de serviço, acompanha cada lavagem desde a **entrada do carro até a entrega** e calcula automaticamente o **resultado do dia**. Ela consome uma **API REST** em Java + Spring Boot, protegida por autenticação JWT.

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React + Vite">
  <img src="https://img.shields.io/badge/Rotas-React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router">
  <img src="https://img.shields.io/badge/Estilo-CSS%20puro-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/API-Spring%20Boot%203.5-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Banco-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

## Demonstração

### Lavagens
<img width="1920" height="953" alt="lavagens" src="https://github.com/user-attachments/assets/9f88417f-f524-49f7-9759-45ec7c5d4ec4" />


### Veículos
<img width="1920" height="956" alt="Veiculos" src="https://github.com/user-attachments/assets/e72e27cb-10cb-4558-99a3-9e62806896a0" />

### Clientes
<img width="1915" height="952" alt="clientes" src="https://github.com/user-attachments/assets/80587d1a-c462-485a-bffc-97123db20fcc" />

### Resultado do dia
<img width="1917" height="954" alt="gestao" src="https://github.com/user-attachments/assets/34512ab5-00a4-4f3e-b460-6bc825ed0725" />

### Funcionários
<img width="1918" height="948" alt="usuarios" src="https://github.com/user-attachments/assets/2f2fba80-45dd-4194-86c1-b3e482031ff7" />

---

## 🚀 Funcionalidades

### 🧽 Lavagens

Tela principal da operação, onde cada serviço vira uma **ordem de serviço**:

- Registro de uma lavagem escolhendo o **veículo** (o cliente vem junto com ele), o **tipo de serviço** e o **valor**
- Tipos de serviço: Lavagem Simples, Lavagem Completa, Higienização, Polimento e Cristalização
- Tabela com veículo, cliente, serviço, horário de entrada, valor e **status**
- Atualização do status direto na lista, mostrando se o carro está **na espera** ou **pronto**
- Remoção da lavagem com **caixa de confirmação**

### 🚘 Veículos

Cadastro dos carros que chegam para lavagem:

- Placa, modelo, marca e **cliente dono do veículo**
- Todo veículo pertence a um cliente já cadastrado
- Filtro de veículos por cliente
- Aviso específico quando o veículo **não pode ser removido** por já estar vinculado a uma lavagem

### 👥 Clientes

Cadastro e manutenção dos clientes do lava-rápido:

- Nome, telefone e endereço
- Cadastro, **edição** e remoção
- Aviso específico quando o cliente possui veículos ou lavagens vinculados

### 📊 Resultado do dia

Visão gerencial de uma data escolhida (padrão: hoje), disponível apenas para **ADMIN**:

- **Ordens no dia** e **faturamento do dia**, em destaque
- Quantidade de ordens em cada etapa: **Recebidos**, **Em lavagem**, **Finalizados** e **Entregues**
- **Faturamento por tipo de serviço**, com quantidade e total de cada um
- Atalhos para registrar lavagem, cadastrar veículo e cadastrar funcionário

### 🔐 Funcionários

Controle de acesso da equipe, disponível apenas para **ADMIN**:

- Cadastro de contas com nome, e-mail, senha e cargo
- Cargos **ADMIN** e **FUNCIONARIO**
- Remoção do acesso com caixa de confirmação

### 🛡️ Segurança e acesso

- Login com e-mail e senha, com sessão por **JWT**
- Rotas protegidas: quem não está logado volta para o login
- O menu lateral mostra "Resultado do dia" e "Funcionários" somente para o administrador
- Sessão derrubada apenas quando o token expira (erro 401). Falta de permissão (403) mostra o aviso e mantém o usuário logado

---

## 🧮 Regras do sistema

### Ciclo de uma lavagem

```text
RECEBIDO  →  EM_LAVAGEM  →  FINALIZADO  →  ENTREGUE
```

| Status | Como aparece | Significado |
| --- | --- | --- |
| `RECEBIDO` | Recebido (na espera) | Veículo chegou e aguarda |
| `EM_LAVAGEM` | Em Lavagem (na espera) | Serviço em execução |
| `FINALIZADO` | Finalizado (pronto) | Serviço concluído, aguardando retirada |
| `ENTREGUE` | Entregue (pronto) | Veículo entregue ao cliente |

### Perfis de usuário

| Perfil | Permissões |
| --- | --- |
| **ADMIN** | Tudo do sistema, incluindo resultado do dia e funcionários |
| **FUNCIONARIO** | Lavagens, veículos e clientes |

### Indicadores do resultado do dia

| Indicador | Como é calculado |
| --- | --- |
| Ordens no dia | Total de ordens de serviço da data escolhida |
| Faturamento do dia | Soma do valor das ordens da data escolhida |
| Recebidos / Em lavagem / Finalizados / Entregues | Quantidade de ordens em cada status |
| Faturamento por tipo | Quantidade e total agrupados por tipo de serviço |

---

## 🏗️ Arquitetura

O sistema é dividido em dois projetos independentes, que se comunicam por **HTTP/REST**. Este repositório contém o Front-end.

```text
                    ┌───────────────────┐
                    │      Usuário      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   React + Vite    │
                    │  Páginas + Rotas  │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌─────────────────┐   ┌───────────────────┐
          │  AuthContext    │   │   services/api.js │
          │ sessão e perfil │   │ chamadas à API    │
          └─────────────────┘   └─────────┬─────────┘
                                          │  HTTP / REST + JWT
                                          ▼
                                ┌───────────────────┐
                                │ Java + Spring Boot│
                                │     API REST      │
                                └─────────┬─────────┘
                                          │  JPA / Hibernate
                                          ▼
                                ┌───────────────────┐
                                │    PostgreSQL     │
                                └───────────────────┘
```

### Estrutura de pastas

```text
Projeto-PitStop/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json              # fallback de rotas (SPA) na Vercel
├── docs/
│   └── screenshots/         # imagens usadas neste README
└── src/
    ├── main.jsx
    ├── App.jsx              # rotas e layout
    ├── index.css            # estilos globais e tokens de cor
    ├── context/
    │   ├── AuthContext.jsx      # login, sessão e perfil
    │   ├── ToastContext.jsx     # avisos de sucesso e erro
    │   └── ConfirmContext.jsx   # caixa de confirmação de remoção
    ├── utils/
    │   └── format.js        # nomes legíveis e erro de vínculo
    ├── services/
    │   └── api.js           # camada única de acesso à API
    ├── components/
    │   ├── Navbar.jsx       # menu lateral
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Home.jsx
        ├── Login.jsx
        └── admin/
            ├── AdminLavagens.jsx
            ├── AdminCarros.jsx
            ├── AdminClientes.jsx
            ├── AdminDashboard.jsx
            └── AdminFuncionarios.jsx
```

---

## 🔌 API REST

O Front-end consome estes endpoints (todos, exceto o login, exigem `Authorization: Bearer <token>`):

| Recurso | Endpoints |
| --- | --- |
| Autenticação | `POST /api/auth/login` |
| Usuários | `GET /api/usuarios` · `POST /api/usuarios` · `DELETE /api/usuarios/{id}` |
| Clientes | `GET/POST /api/clientes` · `PUT/DELETE /api/clientes/{id}` |
| Veículos | `GET/POST /api/veiculos` · `GET /api/veiculos?clienteId={id}` · `PUT/DELETE /api/veiculos/{id}` |
| Ordens de serviço | `GET/POST /api/ordens` · `PATCH /api/ordens/{id}/status` · `DELETE /api/ordens/{id}` |
| Resultado do dia | `GET /api/dashboard` · `GET /api/dashboard?data=AAAA-MM-DD` |

A documentação interativa da API fica no Swagger UI: `http://localhost:8080/swagger-ui.html`.

---

## 🛠️ Tecnologias

- React 19 + Vite 6
- React Router DOM
- CSS puro, com tokens de cor e tipografia (Sora e Manrope)
- Fetch API
- JWT guardado no navegador
- Java 21 + Spring Boot 3.5, Spring Security, JPA/Hibernate e PostgreSQL (API)

- Os dados ficam no banco da API, mas a **sessão** fica salva no navegador. Sair da conta ou expirar o token exige um novo login.
- Credenciais padrão servem apenas para o primeiro acesso. Em produção, use variáveis de ambiente para segredos e senhas.
