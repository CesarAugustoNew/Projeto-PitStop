# 🚗 PitStop Clean Car — Front-end

Front-end em **React + Vite** para o painel do lava-rápido PitStop Clean Car, construído a partir da base do projeto CineSenai. Consome a API **SpringBootAPI-PitStop**.

---

<img width="1916" height="1075" alt="dashboard" src="https://github.com/user-attachments/assets/33916a9f-2e65-458a-9ae6-ec581b12ee6f" />
<br> <br>
<img width="1918" height="1078" alt="lavagens" src="https://github.com/user-attachments/assets/75c51345-6696-48fc-a4fe-34b3cbc610ad" />
<br> <br>
<img width="1916" height="1077" alt="veiculos" src="https://github.com/user-attachments/assets/f135e881-d055-420a-a454-eff2388840f6" />
<br> <br>
<img width="1916" height="1079" alt="clientes" src="https://github.com/user-attachments/assets/4bf5336a-b76b-44c0-b45b-c025f07aa90a" />
<br> <br>
<img width="1920" height="1077" alt="usuarios" src="https://github.com/user-attachments/assets/d4e362de-855f-4f7b-8d55-2eb68c164063" />






## ▶️ Como rodar

```bash
npm install
npm run dev
```
A aplicação sobe em `http://localhost:3000` e o Vite já está configurado para redirecionar `/api/**` para `http://localhost:8080` (ver `vite.config.js`) — por isso a API precisa estar rodando nessa porta.

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
- **Clientes** (`/admin/clientes`, ADMIN e FUNCIONARIO) — cadastra, edita e remove clientes.
- **Veículos** (`/admin/carros`, ADMIN e FUNCIONARIO) — cadastra veículos vinculados a um cliente; permite cadastrar um cliente novo rapidamente, sem sair da tela.
- **Lavagens** (`/admin/lavagens`, ADMIN e FUNCIONARIO) — registra uma lavagem escolhendo o veículo e o tipo de serviço, e permite atualizar o status (Recebido / Em Lavagem / Finalizado / Entregue, ou seja, se o carro está na espera ou já pronto).

A raiz (`/`) só redireciona: para o dashboard se for ADMIN, ou para a tela de Lavagens se for FUNCIONARIO.

---
