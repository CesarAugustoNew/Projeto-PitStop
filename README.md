# 🚗 PitStop Clean Car — Front-end

Front-end em **React + Vite** para o painel do lava-rápido PitStop Clean Car. Consome a API **SpringBootAPI-PitStop**.

---

## ▶️ Como rodar

```bash
npm install
npm run dev
```
A aplicação sobe em `http://localhost:3000` e o Vite já está configurado para redirecionar `/api/**` para `http://localhost:8080` (ver `vite.config.js`).

## 🔐 Login

Use o admin criado automaticamente pelo back-end na primeira execução:
- **E-mail:** `admin@pitstop.com`
- **Senha:** `Admin@134`

A partir dele, cadastre os funcionários em **Funcionários** (menu do admin).

---

## 🚀 Telas

- **Login** (`/login`) — único ponto de entrada; não há autocadastro (contas só são criadas por um ADMIN).
- **Dashboard — Resultado do Dia** (`/admin`, **somente ADMIN**) — total de ordens, status e faturamento do dia, com filtro de data.
- **Funcionários** (`/admin/funcionarios`, **somente ADMIN**) — cadastra contas de ADMIN ou FUNCIONARIO.
- **Veículos** (`/admin/carros`, ADMIN e FUNCIONARIO) — cadastra veículos vinculados a um cliente; permite cadastrar um cliente novo rapidamente, sem sair da tela.
- **Lavagens** (`/admin/lavagens`, ADMIN e FUNCIONARIO) — registra uma lavagem escolhendo o veículo e o tipo de serviço, e permite atualizar o status (Recebido / Em Lavagem / Finalizado / Entregue, ou seja, se o carro está na espera ou já pronto). **Sem essa tela nenhuma lavagem existia de fato, por isso o dashboard sempre mostrava 0.**

A raiz (`/`) só redireciona: para o dashboard se for ADMIN, ou para a tela de Lavagens se for FUNCIONARIO.

---


