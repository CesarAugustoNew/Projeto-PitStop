# 🚗 PitStop Clean Car

Sistema Full Stack para gerenciamento de um lava-rápido, desenvolvido com **React + Vite** no Front-end e **Java + Spring Boot** no Back-end.

O projeto está dividido em dois repositórios independentes — Front-end e Back-end — que se comunicam através de uma **API REST**.

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Backend-Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white" alt="Spring Security">
  <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/JPA%20%2F%20Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white" alt="JPA Hibernate">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Maven-C71A36?style=flat-square&logo=apachemaven&logoColor=white" alt="Maven">
  <img src="https://img.shields.io/badge/Swagger%20%2F%20OpenAPI-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger">
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render">
</p>

---

## 📌 Sobre o Projeto

O **PitStop Clean Car** foi desenvolvido para digitalizar o gerenciamento de um lava-rápido, centralizando as informações de clientes, veículos, funcionários e serviços realizados.

O sistema permite acompanhar uma lavagem desde a entrada do veículo até a sua entrega, mantendo os dados persistidos em banco de dados e protegidos por autenticação.

## 🚀 Funcionalidades

- 🔐 Login e autenticação com JWT
- 👤 Gerenciamento de usuários e funcionários
- 👥 Cadastro e gerenciamento de clientes
- 🚘 Cadastro e gerenciamento de veículos
- 🧽 Registro de lavagens
- 📋 Gerenciamento de ordens de serviço
- 🔄 Atualização do status das lavagens
- 📊 Dashboard com resultados do dia
- 💰 Controle de faturamento
- 🔎 Filtro de veículos por cliente
- 🛡️ Controle de acesso por perfil
- 📖 Documentação da API com Swagger/OpenAPI

---

## 🏗️ Arquitetura

```text
                         USUÁRIO
                            │
                            ▼
                 ┌─────────────────────┐
                 │     React + Vite    │
                 │      Front-end      │
                 └──────────┬──────────┘
                            │
                       HTTP / REST
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Java + Spring Boot │
                 │       API REST      │
                 └──────────┬──────────┘
                            │
                     JPA / Hibernate
                            │
                            ▼
                 ┌─────────────────────┐
                 │      PostgreSQL     │
                 │       Database      │
                 └─────────────────────┘
```

---

# 💻 Front-end

Desenvolvido com **React 19** e **Vite 6**.

### Tecnologias

- React 19
- React Router DOM
- Vite
- JavaScript
- CSS
- Fetch API

### Estrutura

```text
src/
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── ToastContext.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   │
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminClientes.jsx
│       ├── AdminCarros.jsx
│       ├── AdminFuncionarios.jsx
│       └── AdminLavagens.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# ⚙️ Back-end

Desenvolvido utilizando **Java 21** e **Spring Boot 3.5.16**.

### Tecnologias

- Java 21
- Spring Boot 3.5.16
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- PostgreSQL
- Bean Validation
- Lombok
- Maven
- Swagger/OpenAPI
- Spring Boot DevTools

### Arquitetura em camadas

```text
Controller
    │
    ▼
 Service
    │
    ▼
Repository
    │
    ▼
 Entity
    │
    ▼
PostgreSQL
```

---

# 🔐 Segurança

A API utiliza **Spring Security + JWT** com autenticação stateless.

```text
E-mail + Senha
      │
      ▼
POST /api/auth/login
      │
      ▼
Validação das credenciais
      │
      ▼
Geração do JWT
      │
      ▼
Front-end
      │
      ▼
Authorization: Bearer <token>
      │
      ▼
JwtFilter
      │
      ▼
Spring Security
      │
      ▼
Endpoint protegido
```

As senhas são armazenadas utilizando **BCrypt**.

---

# 👥 Perfis de Usuário

| Perfil | Permissões |
|---|---|
| **ADMIN** | Gerenciamento completo do sistema e usuários |
| **FUNCIONARIO** | Clientes, veículos, lavagens, ordens e dashboard |

---

# 🧽 Status das Ordens de Serviço

```text
RECEBIDO
   ↓
EM_LAVAGEM
   ↓
FINALIZADO
   ↓
ENTREGUE
```

| Status | Descrição |
|---|---|
| `RECEBIDO` | Veículo recebido e aguardando |
| `EM_LAVAGEM` | Serviço em execução |
| `FINALIZADO` | Serviço concluído |
| `ENTREGUE` | Veículo entregue ao cliente |

---

# 🔌 API REST

### Autenticação

```text
POST /api/auth/login
```

### Usuários

```text
GET    /api/usuarios
GET    /api/usuarios/{id}
POST   /api/usuarios
DELETE /api/usuarios/{id}
```

### Clientes

```text
GET    /api/clientes
GET    /api/clientes/{id}
POST   /api/clientes
PUT    /api/clientes/{id}
DELETE /api/clientes/{id}
```

### Veículos

```text
GET    /api/veiculos
GET    /api/veiculos/{id}
GET    /api/veiculos?clienteId={id}
POST   /api/veiculos
PUT    /api/veiculos/{id}
DELETE /api/veiculos/{id}
```

### Ordens de Serviço

```text
GET    /api/ordens
GET    /api/ordens/{id}
POST   /api/ordens
PATCH  /api/ordens/{id}/status
DELETE /api/ordens/{id}
```

### Dashboard

```text
GET /api/dashboard
GET /api/dashboard?data=AAAA-MM-DD
```

---

# 📖 Swagger / OpenAPI

A API possui documentação interativa através do **Swagger UI**.

Após iniciar o Back-end:

```text
http://localhost:8080/swagger-ui.html
```

---

# 🗄️ Banco de Dados

O projeto utiliza **PostgreSQL** como banco de dados relacional.

Principais entidades:

```text
Usuario
   │
   │
Cliente ─────── Veiculo
                  │
                  │
                  ▼
            OrdemServico
```

A persistência é realizada utilizando **Spring Data JPA + Hibernate**.

---

# ▶️ Como executar

## Pré-requisitos

- Node.js
- JDK 21+
- Maven
- PostgreSQL
- Git

---

## 1. Back-end

Entre na pasta do projeto da API:

```bash
cd SpringBootAPI-PitStop
```

Configure o banco PostgreSQL no arquivo:

```text
src/main/resources/application.yaml
```

Exemplo:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/CleanCar
    username: postgres
    password: sua_senha
```

Execute:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

A API será executada em:

```text
http://localhost:8080
```

---

## 2. Front-end

Entre na pasta do projeto React:

```bash
cd Projeto-PitStop
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm run dev
```

O Front-end será executado em:

```text
http://localhost:3000
```

---

# 🔑 Usuário Administrador

Na primeira execução da API, um usuário administrador é criado automaticamente.

```text
E-mail: admin@pitstop.com
Senha: Admin@134
```

Após realizar o primeiro login, o administrador pode cadastrar novos usuários pelo módulo de **Funcionários**.

> Em produção, recomenda-se alterar as credenciais padrão e utilizar variáveis de ambiente para informações sensíveis.

---

# 📁 Estrutura dos Projetos

O sistema é composto por dois projetos:

### Front-end

```text
Projeto-PitStop
└── React + Vite
```

### Back-end

```text
SpringBootAPI-PitStop
└── Java + Spring Boot + PostgreSQL
```

Os dois projetos são independentes, mas foram desenvolvidos para funcionar em conjunto através da API REST.

---

# ☁️ Deploy

A aplicação pode ser disponibilizada utilizando uma arquitetura desacoplada:

```text
                 INTERNET
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
       Vercel                 Render
          │                     │
          ▼                     ▼
     React + Vite          Spring Boot API
                                │
                                ▼
                           PostgreSQL
```

- **Front-end:** Vercel
- **Back-end:** Render
- **Banco de dados:** PostgreSQL

---

# 🎯 Objetivo

O projeto tem como objetivo desenvolver uma solução completa para gerenciamento de um lava-rápido, aplicando conceitos de desenvolvimento **Full Stack**, desde a construção da interface até a criação e integração de uma API REST com banco de dados.

Durante o desenvolvimento foram aplicados conceitos como:

- React
- Componentização
- React Router
- API REST
- Java
- Spring Boot
- Spring Security
- JWT
- JPA / Hibernate
- PostgreSQL
- DTOs
- Arquitetura em camadas
- Tratamento global de exceções
- Validação de dados
- Controle de acesso por perfil
- Swagger/OpenAPI
- Git e GitHub

---

