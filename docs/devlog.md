# DevLog — Diário Técnico do Projeto

## 2026-04-05 — Definição da Arquitetura

### Decisões
- Frontend: React + TypeScript + Vite na porta 5173
- Backend: Node.js + Express + TypeScript na porta 3001
- Testes: Vitest com coverage-v8
- Persistência: memória + `data.json` (sem banco de dados)
- Autenticação: simplificada, sem token. Login retorna `{ id, username }`, frontend salva em localStorage. Ações enviam `userId` no body.
- Sala: grid fixo 6 fileiras (A–F) × 8 colunas (1–8) = 48 poltronas

### Testes definidos
- 20 testes unitários: 10 fluxo normal, 10 fluxo de extensão
- Distribuição: auth (7), ticket (6), seat (7)

### Pipeline definido
- 4 jobs: test, build (paralelos), deploy (após ambos), notify (always)
- Deploy via GitHub Release com 3 artifacts
- Notificação via webhook condicional

### Problemas e Resoluções
- Nenhum até aqui.

---

## 2026-04-05/06 — Etapa 1: Estrutura Inicial do Backend

### Criado
- `backend/src/types/index.ts` — interfaces User, Ticket, Seat, StoreData
- `backend/src/store/data.store.ts` — store em memória com geração de 48 poltronas e save/load em `data.json`
- `backend/src/services/auth.service.ts` — stub (register, login)
- `backend/src/services/ticket.service.ts` — stub
- `backend/src/services/seat.service.ts` — stub
- `backend/package.json` — dependências e scripts
- `backend/tsconfig.json` — TypeScript strict, ES modules
- `backend/vitest.config.ts` — Vitest com coverage-v8

### Decisões Técnicas
- Usar `tsx` para development (watch mode)
- Módulos ES (`"type": "module"`)
- Coverage restrito a `src/services`
- Store inicializa com poltronas livres; carrega dados anteriores de `data.json` se existirem

---

## 2026-04-06 — Reorganização do Repositório

### Problema
- Git foi inicializado em `NP1C14/Np1C14/` (subpasta acidental do Windows)
- Arquivos criados foram para `NP1C14/backend/` fora do alcance do git
- Estrutura inconsistente entre raiz e subpasta

### Resolução
- Moveu `.git` e `.gitattributes` para `NP1C14/` (raiz)
- Moveu `backend/` para dentro da raiz do git
- Removeu pasta vazia `NP1C14/Np1C14/`

### Documentação
- Criada `docs/` com 3 arquivos para registrar uso de IA, diário técnico e estrutura

### Commit
- `chore: organiza estrutura do projeto e adiciona documentação de trabalho`

---

## 2026-04-06 — Documentação Retroativa

### Criado
- `docs/ia-prompts.md` — registro de todos os prompts e respostas da IA
- `docs/devlog.md` — este arquivo
- `docs/estrutura-do-projeto.md` — árvore de pastas e descrições

---

## 2026-04-06 — Etapa 2: Implementação de Services e Testes

### Implementado
- **`auth.service.ts`** — register com validação de vazio/duplicado; login por comparação direta de senha
- **`ticket.service.ts`** — claimTicket (valida existência de user e ticket), hasTicket, consumeTicket
- **`seat.service.ts`** — getAllSeats (retorna 48), reserveSeat (valida user, seat, status, ticket; consome ticket ao reservar)
- **`data.store.ts`** — adicionada função `resetStore()` para isolar testes unitários

### Testes criados
- `tests/auth.test.ts` — 7 testes: register válido, IDs únicos, duplicado, vazio×2, login válido, login inválido
- `tests/ticket.test.ts` — 6 testes: claim, hasTicket true/false, duplicado, user inexistente
- `tests/seat.test.ts` — 7 testes: 48 livres, reserva com ticket, consume ticket, re-claim após consumo, sem ticket, ocupada, invalid seat

### Resultado dos testes
20/20 passando. Duração ~340ms.

### Problema e Resolução
**Problema:** Commit inicial `e9cca12` agrupou todos os 7 arquivos em uma única mensagem genérica "etapa 2".
**Resolução:** `git reset --soft` para desfazer o commit, remontagem em 4 commits coesos por módulo, push com `--force-with-lease`.
**Regra criada:** commits devem ser pequenos, por responsabilidade, sempre publicados no remoto com verificação de hash.

### Commits da Etapa 2

| Hash | Mensagem |
|------|----------|
| `a67fdf5` | `refactor(store): adiciona resetStore para isolar testes unitários` |
| `368afdb` | `feat(auth): implementa registro, login e testes unitários` |
| `63aa5b5` | `feat(ticket): implementa claim, status, consumo e testes unitários` |
| `4766eb1` | `feat(seat): implementa listagem, reserva e testes unitários` |

Todos publicados em `origin/main` com hashes verificados.

---

## 2026-04-06 — Etapa 3: Backend HTTP (Rotas Express)

### Criado
- **`backend/src/routes/auth.routes.ts`** — POST `/api/auth/register` e POST `/api/auth/login`
- **`backend/src/routes/ticket.routes.ts`** — GET `/api/ticket/status` e POST `/api/ticket/claim`
- **`backend/src/routes/seat.routes.ts`** — GET `/api/seats` e POST `/api/seats/:id/reserve`
- **`backend/src/index.ts`** — servidor Express na porta 3001, CORS, JSON parsing, montagem de rotas

### Status codes
- Register: 201 criado, 400 validação, 409 duplicado
- Login: 200 sucesso, 401 credenciais inválidas
- Ticket status: 200 sempre
- Ticket claim: 201 criado, 400 já tem ticket, 404 user não existe
- Seats list: 200 sempre (público)
- Seat reserve: 200 sucesso, 400 sem ticket/ocupada, 404 user ou seat não existe

### Commits da Etapa 3

| Hash | Mensagem |
|------|----------|
| `590822b` | `feat(auth-routes): adiciona rotas de cadastro e login` |
| `f94ed55` | `feat(ticket-routes): adiciona rotas de claim e status de ticket` |
| `76ac940` | `feat(seat-routes): adiciona rotas de listagem e reserva de poltronas` |
| `36ec9d2` | `feat(server): adiciona servidor express e integração das rotas` |

### Resultado
API REST com 6 rotas funcionando. 20 testes unitários passando.

---

## 2026-04-06 — Etapa 4: Frontend Base + Integração com Backend

### Criado
- **`frontend/index.html`** — HTML base com import do main.tsx
- **`frontend/package.json`** — React 18 + Vite + TypeScript
- **`frontend/tsconfig.json`** — TS com JSX react-jsx
- **`frontend/vite.config.ts`** — Vite porta 5173, proxy `/api` -> `localhost:3001`
- **`frontend/src/main.tsx`** — Entry point React
- **`frontend/src/App.tsx`** — Roteamento simples por estado (login/register/cinema)
- **`frontend/src/api/client.ts`** — Fetch wrapper centralizado para todas as 6 rotas
- **`frontend/src/context/AuthContext.tsx`** — Estado de autenticação + localStorage
- **`frontend/src/pages/LoginPage.tsx`** — Tela de login com card escuro, campos username/password, botão vermelho
- **`frontend/src/pages/RegisterPage.tsx`** — Tela de cadastro com mesmo padrão visual
- **`frontend/src/pages/CinemaPage.tsx`** — Tela principal: header, botão ticket, SeatMap, Screen, legenda
- **`frontend/src/components/SeatMap.tsx`** — Grid 6×8 de poltronas por fileira
- **`frontend/src/components/Seat.tsx`** — Poltrona individual com 3 estados visuais
- **`frontend/src/components/Screen.tsx`** — Faixa "TELA" com gradiente e glow
- **`frontend/src/styles/global.css`** — Dark theme premium: variáveis CSS, vermelho primário

### Referência Visual
A estética do projeto foi inspirada em uma referência visual enviada pelo usuário (card escuro centralizado, botão vermelho, assentos arredondados, tela estilizada). A referência foi usada **apenas como base estética**. Elementos que não fazem parte do escopo do projeto foram removidos: VIP, estrelas, preço, filme específico, IMAX, duração, lembrar-me, forgot password, metadados de sessão.

### Ajuste do Fluxo de Reserva
**Problema:** Fluxo original de `handleSeatClick` tinha comportamento inconsistente — clicar em outra poltrona livre enquanto uma estava selecionada reservava automaticamente a anterior sem confirmação clara.
**Correção:** Nova lógica:
- Poltrona ocupada → não selecionável
- Sem ticket → bloqueia com mensagem de erro
- Clicar em poltrona livre → apenas seleciona visualmente
- Clicar na mesma poltrona selecionada → confirma a reserva
- Clicar em outra poltrona livre → muda a seleção, não reserva automaticamente
- Após reserva → limpa seleção, atualiza poltronas, atualiza ticket, mostra mensagem

### Commits da Etapa 4

| Hash | Mensagem |
|------|----------|
| `627c0cc` | `feat(frontend-base): cria estrutura inicial do frontend` |
| `bb26f77` | `feat(auth-ui): adiciona telas de login e cadastro com integração de API` |
| `fcde3b1` | `feat(cinema-ui): adiciona tela da sala e componentes visuais` |
| `ee440c1` | `fix(cinema-ui): melhora fluxo de reserva e estilos do SeatMap` + docs |
| `0c786ce` | `fix(cinema-ui): ajusta fluxo de selecao e reserva de poltronas` |

### Resultado
Frontend completo integrado com backend. Fluxo end-to-end: cadastro → login → pegar ticket → selecionar poltrona → reservar. Dark theme premium publicado no GitHub.

---

## 2026-04-06 — Etapa 5: CI/CD com GitHub Actions

### Pipeline criado
- **`.github/workflows/ci-cd.yml`** — 4 jobs com paralelismo, geração de artifacts, release automatizado e notificação por webhook

### Jobs
| Job | Paralelismo | Dependências | Descrição |
|-----|-------------|-------------|-----------|
| `test` | roda em paralelo com `build` | nenhuma | Instala deps do backend, roda 20 testes unitários com coverage, gera artifact `test-results` |
| `build` | roda em paralelo com `test` | nenhuma | Build do frontend (`vite build`), validação backend (`tsc --noEmit`), gera artifacts `frontend-dist` e `backend-package` |
| `deploy` | sequencial | `needs: [test, build]` | Baixa todos os artifacts, cria GitHub Release com tag `v1.0.0-ci` anexo os 3 artifacts |
| `notify` | sequencial | `needs: [test, build, deploy]` + `if: always()` | Calcula status consolidado (`success`/`failure`/`cancelled`), envia POST para `${{ secrets.WEBHOOK_URL }}` se a secret existir |

### Artifacts
| Artifact | Conteúdo | Job de origem |
|----------|----------|--------------|
| `test-results` | Relatório de cobertura do Vitest (HTML + JSON) | test |
| `frontend-dist` | Output do `vite build` (frontend/dist/) | build |
| `backend-package` | Backend empacotado sem node_modules | build |

### Configuraçã de Release

- Tag: `v1.0.0-ci`
- Nome: `v1.0.0-ci - Pipeline Build`
- Tipo: `prerelease: true`
- Body: descreve artifacts anexados
- Arquivos anexados: test-results/. frontend-dist/. backend-package

### Decisões
- `notify` usa `if: always()` para sempre executar no final
- Webhook é condicional: `if: env.WEBHOOK_URL != ''` — sem erro se secret não existir
- Nenhum valor hardcoded (URL, e-mail ou token no código)
- Test e build rodam em paralelo (satisfaz requisito de paralelismo)
- Deploy só acontece se test E build passarem
