# Cinema App

Sistema web simples de reserva de poltronas para cinema, desenvolvido como atividade acadêmica de CI/CD.

## Funcionalidades

- **Cadastro e login** de usuários (autenticação simplificada, sem tokens)
- **Sistema de ticket**: para reservar uma poltrona, é necessário pegar um ticket primeiro
- **Mapa da sala**: visualização interativa das 48 poltronas (6 fileiras × 8 colunas)
- **Reserva de poltrona**: selecione e confirme uma poltrona livre — o ticket é consumido automaticamente
- **Estado visual**: poltronas livres (verde), ocupadas (vermelho) e selecionadas (amarelo)

## Arquitetura

| Camada | Tecnologia | Porta |
|--------|-----------|-------|
| Frontend | React + TypeScript + Vite | 5173 |
| Backend | Node.js + Express + TypeScript | 3001 |
| Persistência | Memória + arquivo `data.json` | — |
| Testes | Vitest com coverage-v8 | — |
| CI/CD | GitHub Actions | — |

O frontend se comunica com o backend via API REST (6 rotas). Não há banco de dados: os dados são mantidos em memória e persistidos em `backend/data.json`.

## Estrutura do Projeto

```
NP1C14/
├── .github/workflows/ci-cd.yml   # Pipeline CI/CD (test, build, deploy, notify)
│
├── backend/                      # Backend — Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts              # Servidor Express (porta 3001)
│   │   ├── routes/               # Rotas HTTP (auth, ticket, seat)
│   │   ├── services/             # Regras de negócio puras
│   │   ├── store/                # Persistência em memória + data.json
│   │   └── types/                # Interfaces TypeScript
│   └── tests/                    # Testes unitários com Vitest (20 testes)
│
├── frontend/                     # Frontend — React + TypeScript + Vite
│   ├── src/
│   │   ├── main.tsx              # Entry point
│   │   ├── App.tsx               # Roteamento por estado
│   │   ├── api/                  # Camada de comunicação com backend
│   │   ├── components/           # SeatMap, Seat, Screen
│   │   ├── context/              # Estado de autenticação
│   │   ├── pages/                # Login, Cadastro, Cinema
│   │   └── styles/               # Estilos globais (dark theme)
│   └── index.html                # HTML base
│
└── docs/                         # Documentação do projeto
    ├── devlog.md                 # Diário técnico
    ├── ia-prompts.md             # Registro de prompts de IA
    └── estrutura-do-projeto.md   # Descrição das pastas
```

### Detalhe das pastas

| Pasta | Função |
|-------|--------|
| `.github/workflows/` | Workflow do GitHub Actions com 4 jobs: test, build, deploy, notify |
| `backend/src/routes/` | Roteadores Express — definem endpoints e chamam os services |
| `backend/src/services/` | Regras de negócio puras (autenticação, ticket, poltronas) |
| `backend/src/store/` | Acesso a dados em memória com persistência em `data.json` |
| `backend/src/types/` | Interfaces TypeScript (User, Ticket, Seat, StoreData) |
| `backend/tests/` | 20 testes unitários (auth, ticket, seat) com Vitest |
| `frontend/` | Aplicação React — páginas, componentes, estilos |
| `frontend/src/api/` | Fetch wrapper centralizado para todas as rotas da API |
| `frontend/src/components/` | Componentes visuais reutilizáveis (SeatMap, Seat, Screen) |
| `frontend/src/context/` | Estado global de autenticação com localStorage |
| `frontend/src/pages/` | Telas da aplicação (Login, Cadastro, Cinema) |
| `frontend/src/styles/` | Variáveis CSS e estilos globais (dark theme premium) |
| `docs/` | Documentação: diário técnico, prompts de IA, estrutura |

## Como Rodar

### Pré-requisitos

- Node.js 20+
- npm

### 1. Instalar dependências do backend

```bash
cd backend
npm install
```

### 2. Iniciar o backend

```bash
cd backend
npm run dev
```

O backend inicia na porta **3001**. Você deve ver: `Servidor rodando na porta 3001`.

### 3. Instalar dependências do frontend (em outro terminal)

```bash
cd frontend
npm install
```

### 4. Iniciar o frontend

```bash
cd frontend
npm run dev
```

O frontend inicia na porta **5173** e abre automaticamente no navegador. O Vite configura um proxy de `/api` para `localhost:3001`, então não é necessário configurar CORS.

### 5. Acessar

Abra **http://localhost:5173** no navegador.

## Como Testar a Aplicação

Siga o fluxo completo:

1. **Cadastre um usuário**: clique em "Criar Conta", digite username e senha, clique em "Cadastrar"
2. **Faça login**: voltará para a tela de login, use as mesmas credenciais
3. **Pegue um ticket**: na tela da sala, clique em **"Pegar Ticket"**. O botão mudará para "Ticket ativo"
4. **Reserve uma poltrona**:
   - Clique em uma poltrona **verde** (livre) — ela fica amarela (selecionada)
   - Clique na **mesma poltrona** novamente para confirmar a reserva
   - A poltrona fica **vermelha** (ocupada)
5. **Verifique o consumo do ticket**: o botão voltará a "Pegar Ticket" — o ticket foi consumido
6. **Tente reservar outra poltrona sem ticket**: você receberá a mensagem **"Você precisa de um ticket ativo para reservar uma poltrona"**
7. **Comportamento esperado**: poltronas ocupadas não podem ser selecionadas; é impossível reservar a mesma poltrona duas vezes

Para testar com outro usuário, faça logout, cadastre-se novamente e tente interagir com as poltronas.

## Testes Unitários

### Backend

20 testes unitários cobrindo os 3 services:

```bash
cd backend
npm test
```

Distribuição: 7 auth, 6 ticket, 7 seat. Todos passando (~340ms).

### Frontend

Não há testes unitários no frontend no escopo atual desta atividade.

## CI/CD

O workflow `.github/workflows/ci-cd.yml` executa 4 jobs a cada push em `main`:

| Job | O que faz |
|-----|-----------|
| **test** | Instala deps do backend e roda 20 testes com Vitest + coverage |
| **build** | Build do frontend (Vite), validação TypeScript do backend, empacotamento |
| **deploy** | Cria um GitHub Release (`v1.0.0-ci`) com 3 artifacts anexados |
| **notify** | Envia notificação via webhook (`WEBHOOK_URL`), roda sempre (`if: always()`) |

Os jobs `test` e `build` rodam em paralelo. `deploy` espera ambos concluírem. `notify` roda independente do resultado.

Para configurar a notificação, crie um secret `WEBHOOK_URL` nas configurações do repositório.

## Observações

- **Sem pagamento real**: o botão de "pagamento" não faz parte do escopo
- **Sem autenticação complexa**: não há JWT, tokens ou Bearer auth — login retorna `{ id, username }` diretamente
- **Sem banco de dados**: persistência em memória com salva em `data.json`
- **Foco acadêmico**: este projeto foi criado como trabalho de CI/CD, priorizando demonstração de pipeline funcional sobre robustez de produção
