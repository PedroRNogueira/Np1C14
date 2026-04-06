# Cinema App

Sistema web simples de reserva de poltronas para cinema, desenvolvido como atividade acad\xeamica de CI/CD.

## Funcionalidades

- **Cadastro e login** de usu\xe1rios (autentica\xe7\xe3o simplificada, sem tokens)
- **Sistema de ticket**: para reservar uma poltrona, \xe9 necess\xe1rio pegar um ticket primeiro
- **Mapa da sala**: visualiza\xe7\xe3o interativa das 48 poltronas (6 fileiras \xd7 8 colunas)
- **Reserva de poltrona**: selecione e confirme uma poltrona livre — o ticket \xe9 consumido automaticamente
- **Estado visual**: poltronas livres (verde), ocupadas (vermelho) e selecionadas (amarelo)

## Arquitetura

| Camada | Tecnologia | Porta |
|--------|-----------|-------|
| Frontend | React + TypeScript + Vite | 5173 |
| Backend | Node.js + Express + TypeScript | 3001 |
| Persist\xeancia | Mem\xf3ria + arquivo `data.json` | — |
| Testes | Vitest com coverage-v8 | — |
| CI/CD | GitHub Actions | — |

O frontend se comunica com o backend via API REST (6 rotas). N\xe3o h\xe1 banco de dados: os dados s\xe3o mantidos em mem\xf3ria e persistidos em `backend/data.json`.

## Estrutura do Projeto

```
NP1C14/
├── .github/workflows/ci-cd.yml   # Pipeline CI/CD (test, build, deploy, notify)
│
├── backend/                      # Backend — Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts              # Servidor Express (porta 3001)
│   │   ├── routes/               # Rotas HTTP (auth, ticket, seat)
│   │   ├── services/             # Regras de neg\xf3cio puras
│   │   ├── store/                # Persist\xeancia em mem\xf3ria + data.json
│   │   └── types/                # Interfaces TypeScript
│   └── tests/                    # Testes unit\xe1rios com Vitest (20 testes)
│
├── frontend/                     # Frontend — React + TypeScript + Vite
│   ├── src/
│   │   ├── main.tsx              # Entry point
│   │   ├── App.tsx               # Roteamento por estado
│   │   ├── api/                  # Camada de comunica\xe7\xe3o com backend
│   │   ├── components/           # SeatMap, Seat, Screen
│   │   ├── context/              # Estado de autentica\xe7\xe3o
│   │   ├── pages/                # Login, Cadastro, Cinema
│   │   └── styles/               # Estilos globais (dark theme)
│   └── index.html                # HTML base
│
└── docs/                         # Documenta\xe7\xe3o do projeto
    ├── devlog.md                 # Di\xe1rio t\xe9cnico
    ├── ia-prompts.md             # Registro de prompts de IA
    └── estrutura-do-projeto.md   # Descri\xe7\xe3o das pastas
```

### Detalhe das pastas

| Pasta | Fun\xe7\xe3o |
|-------|--------|
| `.github/workflows/` | Workflow do GitHub Actions com 4 jobs: test, build, deploy, notify |
| `backend/src/routes/` | Roteadores Express — definem endpoints e chamam os services |
| `backend/src/services/` | Regras de neg\xf3cio puras (autentica\xe7\xe3o, ticket, poltronas) |
| `backend/src/store/` | Acesso a dados em mem\xf3ria com persist\xeancia em `data.json` |
| `backend/src/types/` | Interfaces TypeScript (User, Ticket, Seat, StoreData) |
| `backend/tests/` | 20 testes unit\xe1rios (auth, ticket, seat) com Vitest |
| `frontend/` | Aplica\xe7\xe3o React — p\xe1ginas, componentes, estilos |
| `frontend/src/api/` | Fetch wrapper centralizado para todas as rotas da API |
| `frontend/src/components/` | Componentes visuais reutiliz\xe1veis (SeatMap, Seat, Screen) |
| `frontend/src/context/` | Estado global de autentica\xe7\xe3o com localStorage |
| `frontend/src/pages/` | Telas da aplica\xe7\xe3o (Login, Cadastro, Cinema) |
| `frontend/src/styles/` | Vari\xe1veis CSS e estilos globais (dark theme premium) |
| `docs/` | Documenta\xe7\xe3o: di\xe1rio t\xe9cnico, prompts de IA, estrutura |

## Como Rodar

### Pr\xe9-requisitos

- Node.js 20+
- npm

### 1. Instalar depend\xeancias do backend

```bash
cd backend
npm install
```

### 2. Iniciar o backend

```bash
cd backend
npm run dev
```

O backend inicia na porta **3001**. Voc\xea deve ver: `Servidor rodando na porta 3001`.

### 3. Instalar depend\xeancias do frontend (em outro terminal)

```bash
cd frontend
npm install
```

### 4. Iniciar o frontend

```bash
cd frontend
npm run dev
```

O frontend inicia na porta **5173** e abre automaticamente no navegador. O Vite configura um proxy de `/api` para `localhost:3001`, ent\xe3o n\xe3o \xe9 necess\xe1rio configurar CORS.

### 5. Acessar

Abra **http://localhost:5173** no navegador.

## Como Testar a Aplica\xe7\xe3o

Siga o fluxo completo:

1. **Cadastre um usu\xe1rio**: clique em "Criar Conta", digite username e senha, clique em "Cadastrar"
2. **Fa\xe7a login**: voltar\xe1 para a tela de login, use as mesmas credenciais
3. **Pegue um ticket**: na tela da sala, clique em **"Pegar Ticket"**. O bot\xe3o mudar\xe1 para "Ticket ativo"
4. **Reserve uma poltrona**:
   - Clique em uma poltrona **verde** (livre) — ela fica amarela (selecionada)
   - Clique na **mesma poltrona** novamente para confirmar a reserva
   - A poltrona fica **vermelha** (ocupada)
5. **Verifique o consumo do ticket**: o bot\xe3o voltar\xe1 a "Pegar Ticket" — o ticket foi consumido
6. **Tente reservar outra poltrona sem ticket**: voc\xea receber\xe1 a mensagem **"Voc\xea precisa de um ticket ativo para reservar uma poltrona"**
7. **Comportamento esperado**: poltronas ocupadas n\xe3o podem ser selecionadas; \xe9 imposs\xedvel reservar a mesma poltrona duas vezes

Para testar com outro usu\xe1rio, fa\xe7a logout, cadastre-se novamente e tente interagir com as poltronas.

## Testes Unit\xe1rios

### Backend

20 testes unit\xe1rios cobrindo os 3 services:

```bash
cd backend
npm test
```

Distribui\xe7\xe3o: 7 auth, 6 ticket, 7 seat. Todos passando (~340ms).

### Frontend

N\xe3o h\xe1 testes unit\xe1rios no frontend no escopo atual desta atividade.

## CI/CD

O workflow `.github/workflows/ci-cd.yml` executa 4 jobs a cada push em `main`:

| Job | O que faz |
|-----|-----------|
| **test** | Instala deps do backend e roda 20 testes com Vitest + coverage |
| **build** | Build do frontend (Vite), valida\xe7\xe3o TypeScript do backend, empacotamento |
| **deploy** | Cria um GitHub Release (`v1.0.0-ci`) com 3 artifacts anexados |
| **notify** | Envia notifica\xe7\xe3o via webhook (`WEBHOOK_URL`), roda sempre (`if: always()`) |

Os jobs `test` e `build` rodam em paralelo. `deploy` espera ambos conclu\xedrem. `notify` roda independente do resultado.

Para configurar a notifica\xe7\xe3o, crie um secret `WEBHOOK_URL` nas configura\xe7\xf5es do reposit\xf3rio.

## Observa\xe7\xf5es

- **Sem pagamento real**: o bot\xe3o de "pagamento" n\xe3o faz parte do escopo
- **Sem autentica\xe7\xe3o complexa**: n\xe3o h\xe1 JWT, tokens ou Bearer auth — login retorna `{ id, username }` diretamente
- **Sem banco de dados**: persist\xeancia em mem\xf3ria com salva em `data.json`
- **Foco acad\xeamico**: este projeto foi criado como trabalho de CI/CD, priorizando demonstra\xe7\xe3o de pipeline funcional sobre robustez de produ\xe7\xe3o
- **Sem registro de prompts de IA na documenta\xe7\xe3o**: os prompts utilizados para desenvolver o projeto est\xe3o registrados em `docs/ia-prompts.md`
