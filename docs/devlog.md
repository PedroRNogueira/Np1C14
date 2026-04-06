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
