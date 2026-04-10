# Cinema App

Aplicação web simples de cinema desenvolvida para a atividade de CI/CD.

O sistema permite que o usuário:
- faça cadastro
- realize login
- pegue um ticket
- visualize o mapa de poltronas
- reserve uma poltrona disponível

O projeto foi dividido em frontend e backend, com deploy público para facilitar a validação pelo professor.

---

## O que foi desenvolvido

### Frontend
O frontend foi desenvolvido com React, TypeScript e Vite.

A interface foi organizada para atender o fluxo principal da atividade:
- tela de login
- tela de cadastro
- tela principal do cinema
- exibição do mapa de poltronas
- ação para pegar ticket
- ação para reservar poltrona

A aplicação funciona como uma SPA, ou seja, a navegação entre as telas acontece dentro da própria interface, sem rotas públicas separadas como `/login` ou `/register`.

### Backend
O backend foi desenvolvido com Node.js, Express e TypeScript.

A API foi organizada em três áreas principais:
- autenticação
- ticket
- poltronas

Também foram implementadas regras básicas para o fluxo da aplicação:
- cadastro de usuário
- login
- verificação de ticket
- geração de ticket
- listagem de poltronas
- reserva de poltrona

### CI/CD
O projeto possui automação com GitHub Actions para:
- instalação de dependências
- execução de testes do backend
- build do frontend
- build do backend
- geração de artefatos
- deploy do frontend no GitHub Pages

### Deploy
O projeto foi preparado para deploy público em dois serviços:
- frontend no GitHub Pages
- backend no Render

---

## Tecnologias utilizadas

### Frontend
- React
- TypeScript
- Vite

### Backend
- Node.js
- Express
- TypeScript

### CI/CD
- GitHub Actions

### Deploy
- GitHub Pages
- Render

---

## URLs públicas do projeto

### Frontend
```text
https://pedrornogueira.github.io/Np1C14/
```

### Backend
```text
https://cinema-app-backend-pedrornogueira.onrender.com/api
```

### Exemplo de rota pública do backend
```text
https://cinema-app-backend-pedrornogueira.onrender.com/api/seats
```

---

## Como acessar o sistema

Para usar a aplicação pela interface web, basta abrir:

```text
https://pedrornogueira.github.io/Np1C14/
```

Ao abrir o frontend, o usuário verá a tela inicial de login.

A partir dela, é possível:
- entrar com um usuário existente
- ir para a tela de cadastro
- após login bem-sucedido, acessar a tela principal do cinema

---

## Como testar pela interface web

Fluxo recomendado de teste:

1. Abrir o frontend no GitHub Pages
2. Criar um usuário na tela de cadastro
3. Fazer login com esse usuário
4. Verificar a tela principal do cinema
5. Clicar em **Pegar ticket**
6. Escolher uma poltrona livre
7. Confirmar a reserva

Esse é o fluxo principal esperado da aplicação.

---

## Como o frontend conversa com o backend

Em produção, o frontend consome a API pública do backend hospedada no Render.

Base usada pela aplicação em produção:

```text
https://cinema-app-backend-pedrornogueira.onrender.com/api
```

Em ambiente local:
- o frontend roda em `http://localhost:5173`
- o backend roda em `http://localhost:3001`
- o Vite faz proxy de `/api` para o backend local

---

## Rotas do backend

Base da API:

```text
https://cinema-app-backend-pedrornogueira.onrender.com/api
```

### 1) Autenticação

#### POST `/api/auth/register`
Cria um novo usuário.

Exemplo de body:
```json
{
  "username": "teste",
  "password": "123456"
}
```

Exemplo de resposta esperada:
```json
{
  "id": "algum-id",
  "username": "teste"
}
```

---

#### POST `/api/auth/login`
Realiza login com um usuário já cadastrado.

Exemplo de body:
```json
{
  "username": "teste",
  "password": "123456"
}
```

Exemplo de resposta esperada:
```json
{
  "id": "algum-id",
  "username": "teste"
}
```

---

### 2) Ticket

#### GET `/api/ticket/status?userId=ID_DO_USUARIO`
Verifica se o usuário já possui ticket.

Exemplo:
```text
GET /api/ticket/status?userId=123
```

Exemplo de resposta:
```json
{
  "hasTicket": true
}
```

ou

```json
{
  "hasTicket": false
}
```

---

#### POST `/api/ticket/claim`
Gera um ticket para o usuário.

Exemplo de body:
```json
{
  "userId": "123"
}
```

Exemplo de resposta:
```json
{
  "message": "Ticket claimed"
}
```

---

### 3) Poltronas

#### GET `/api/seats`
Lista todas as poltronas do cinema.

Exemplo:
```text
https://cinema-app-backend-pedrornogueira.onrender.com/api/seats
```

Exemplo de resposta:
```json
[
  {
    "id": "A1",
    "row": "A",
    "number": 1,
    "status": "free"
  }
]
```

---

#### POST `/api/seats/:id/reserve`
Reserva uma poltrona pelo seu identificador.

Exemplo:
```text
POST /api/seats/A1/reserve
```

Exemplo de body:
```json
{
  "userId": "123"
}
```

Exemplo de resposta:
```json
{
  "message": "Seat reserved"
}
```

---

## Ordem recomendada de teste direto pela API

Caso o professor queira validar a aplicação sem usar a interface web, a sequência ideal é:

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. guardar o `id` retornado no login
4. `GET /api/ticket/status?userId=...`
5. `POST /api/ticket/claim`
6. `GET /api/seats`
7. `POST /api/seats/:id/reserve`

---

## Como rodar localmente

### Backend
```bash
cd backend
npm install
npm run dev
```

Backend local:
```text
http://localhost:3001
```

---

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend local:
```text
http://localhost:5173
```

---

## Estrutura do projeto

```text
Np1C14/
├── backend/
│   ├── src/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── docs/
└── .github/workflows/
```

---

## Observações importantes

- O frontend é acessado por uma única URL pública:
  ```text
  https://pedrornogueira.github.io/Np1C14/
  ```

- A navegação entre login, cadastro e cinema acontece dentro da própria aplicação.

- A raiz do backend pode exibir:
  ```text
  Cannot GET /
  ```
  Isso é normal, porque o backend foi feito para responder nas rotas da API.

- Uma rota pública válida do backend é:
  ```text
  https://cinema-app-backend-pedrornogueira.onrender.com/api/seats
  ```

- Em produção, o frontend utiliza a base do projeto no GitHub Pages:
  ```text
  /Np1C14/
  ```

---

## Automação e pipeline

O projeto foi preparado com GitHub Actions para automatizar as etapas principais de CI/CD.

Entre as tarefas automatizadas estão:
- instalação de dependências
- testes do backend
- build do frontend
- build do backend
- geração de artefatos
- deploy do frontend no GitHub Pages

---

## Resumo para validação do professor

Para validar o projeto da forma mais simples, basta:

1. abrir o frontend:
   ```text
   https://pedrornogueira.github.io/Np1C14/
   ```

2. criar um usuário

3. fazer login

4. pegar um ticket

5. escolher uma poltrona

6. confirmar a reserva

Se preferir validar diretamente a API, pode usar:

```text
https://cinema-app-backend-pedrornogueira.onrender.com/api/seats
```

---

## Uso de IA

Este projeto contou com apoio de IA como ferramenta de suporte para:
- organização do projeto
- documentação
- estruturação do fluxo de CI/CD
- apoio na implementação
- apoio na revisão do deploy
