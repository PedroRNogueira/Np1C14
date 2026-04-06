# IA Prompts — Registro de Solicitações

## Etapa 0 — Definição da Arquitetura (2026-04-05)

**Pedido do usuário:**
- Criar do zero um projeto web simples para atividade acadêmica de CI/CD
- Site de cinema com login/cadastro, mapa de poltronas, reserva e sistema de tickets
- Stack obrigatória: React+TS+Vite (frontend), Node+Express+TS (backend), Vitest (testes), npm
- Sem Docker, sem banco complexo, sem pagamento, sem autenticação avançada
- Pipeline CI/CD com 3+ jobs, paralelismo, artifacts, deploy e notificação
- Mínimo 20 testes unitários (10 normais + 10 extensão)
- README explicativo
- Trabalhar por etapas, priorizando clareza

**Resposta da IA:**
- Propôs arquitetura com frontend/backend separados, persistência em `data.json`
- Definiu 3 telas: Login, Cadastro, Sala de Cinema
- Definiu 6 rotas REST
- Listou 11 regras de negócio
- Listou 20 testes (7 auth, 6 ticket, 7 seat)
- Propôs 9 etapas de implementação

**Resultado:** Arquitetura aprovada com ajustes pendentes.

---

## Etapa 0.1 — Remoção de Autenticação Avançada (2026-04-05)

**Pedido do usuário:**
- Remover totalmente tokens, JWT, Bearer Authorization
- Login retorna `{ id, username }`, frontend salva em localStorage
- Ações usam `userId` no body em vez de header
- Manter 20 testes como testes unitários de services
- Definir deploy como GitHub Releases de artefatos
- Definir notificação como webhook via secret (sem hardcoded)

**Resposta da IA:**
- Revisou arquitetura removendo qualquer referência a token
- Rotas atualizadas para usar `userId` no body
- Regras de negócio reescritas
- Strategy de deploy: GitHub Release com 3 artifacts
- Notificação via `${{ secrets.WEBHOOK_URL }}` condicional

**Resultado:** Aprovado com correções pendentes.

---

## Etapa 0.2 — Correção de Contagem de Testes e Pipeline (2026-04-05)

**Pedido do usuário:**
- Exatamente 20 testes: 10 normais + 10 extensão
- Correção de erro onde auth.service listava 6 testes mas continha 7
- Pipeline deve ter claramente: test, build, deploy, notificação
- Pelo menos 1 job em paralelo
- Artifacts: test-results, frontend-dist, backend-package
- Deploy como GitHub Release

**Resposta da IA:**
- Contagem corrigida e distribuída por service
- Pipeline com 4 jobs: test, build, deploy, notify
- Test e build em paralelo; deploy depende de ambos; notify depende de todos
- 3 artifacts definidos para anexação ao Release

**Resultado:** Aprovado com ajuste final pendente.

---

## Etapa 0.3 — Ajuste Final do Job Notify (2026-04-05)

**Pedido do usuário:**
- `notify` deve depender de `[test, build, deploy]`
- `if: always()` para rodar mesmo se jobs anteriores falharem
- Notificação informa status consolidado

**Resposta da IA:**
- Ajustou `needs: [test, build, deploy]` e `if: always()`
- Lógica de status: `success`, `failure`, `cancelled` baseado nos `needs.*.result`

**Resultado:** Proposal final aprovada.

---

## Etapa 1 — Criação dos Arquivos Iniciais do Backend (2026-04-05/06)

**Pedido do usuário:**
- Gerar apenas Etapa 1: estrutura, package.json, tsconfig.json, vitest.config.ts, tipos, store, stubs de services
- Não gerar frontend, workflow ou tudo de uma vez

**Resposta da IA:**
- Criou estrutura de diretórios (`backend/src/{store,services,types,routes}`, `backend/tests`)
- Gerou 6 arquivos: package.json, tsconfig.json, vitest.config.ts, tipos, store, stubs dos 3 services

**Resultado:** Estrutura criada. Stubs prontos para implementação.

---

## Etapa 1.1 — Reorganização e Documentação (2026-04-06)

**Pedido do usuário:**
- Criar pasta `docs/` com `ia-prompts.md`, `devlog.md`, `estrutura-do-projeto.md`
- Migrar git para raiz `NP1C14`, remover pasta `Np1C14`
- Documentar retroativamente tudo
- Commit: `chore: organiza estrutura do projeto e adiciona documentação de trabalho`

**Resposta da IA:**
- Moveu `.git` para raiz, trouxe `backend/` para raiz, removeu `Np1C14/`
- Criou 3 documentos retroativos

**Resultado:** Projeto reorganizado e documentado. Commit `ba83232`.

---

## Etapa 2 — Services e Testes Unitários (2026-04-06)

**Pedido do usuário:**
- Implementar lógica real de `auth.service.ts`, `ticket.service.ts`, `seat.service.ts`
- Criar testes unitários correspondentes (20 testes: 7 auth, 6 ticket, 7 seat)
- Sem rotas, sem frontend, sem workflow
- Commits separados por responsabilidade, publicados no remoto

**Resposta da IA:**
- Implementou `auth.service.ts` com register (validação username/password único) e login (credenciais diretas)
- Implementou `ticket.service.ts` com claimTicket, hasTicket, consumeTicket
- Implementou `seat.service.ts` com getAllSeats e reserveSeat (validações: usuário existe, seat existe, não ocupado, tem ticket)
- Adicionou `resetStore()` em `data.store.ts` para isolar testes
- Criou 3 arquivos de teste com Vitest — 20 testes, todos passando

**Ajuste de commits:**
- Commit original genérico `e9cca12` foi reescrito em 4 commits coesos:
  - `a67fdf5 refactor(store): adiciona resetStore para isolar testes unitários`
  - `368afdb feat(auth): implementa registro, login e testes unitários`
  - `63aa5b5 feat(ticket): implementa claim, status, consumo e testes unitários`
  - `4766eb1 feat(seat): implementa listagem, reserva e testes unitários`
- Push com `--force-with-lease` — hashes local e remoto verificados e iguais

**Resultado:** 20 testes passando. 4 commits publicados e visíveis no GitHub web.

---

## Etapa 3 — Backend HTTP (Rotas Express) (2026-04-06)

**Pedido do usuário:**
- Criar rotas HTTP para auth, ticket e seat
- Criar servidor Express integrado
- Manter simples, sem auth complexa, sem frontend nesta etapa

**Resposta da IA:**
- Criou `auth.routes.ts`: POST `/api/auth/register` (201/400/409), POST `/api/auth/login` (200/401)
- Criou `ticket.routes.ts`: GET `/api/ticket/status` (200), POST `/api/ticket/claim` (201/400/404)
- Criou `seat.routes.ts`: GET `/api/seats` (200), POST `/api/seats/:id/reserve` (200/400/404)
- Criou `index.ts`: Express na porta 3001 com CORS e JSON parsing
- 4 commits separados, todos publicados no remoto com verificação de hash

**Resultado:** API REST funcional. 6 rotas expostas. 20 testes ainda passando.
