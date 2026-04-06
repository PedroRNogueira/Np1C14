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
- Regra fixa: commits pequenos, por responsabilidade, sempre publicados no remoto com verificação de hash

**Resposta da IA:**
- Implementou `auth.service.ts` com register (validação username/password único) e login (credenciais diretas)
- Implementou `ticket.service.ts` com claimTicket, hasTicket, consumeTicket
- Implementou `seat.service.ts` com getAllSeats e reserveSeat (validações: usuário existe, seat existe, não ocupado, tem ticket)
- Adicionou `resetStore()` em `data.store.ts` para isolar testes
- Criou 3 arquivos de teste com Vitest — 20 testes, todos passando

**Ajuste de commits:**
- Commit original genérico `e9cca12` foi reescrito em 4 commits coesos:
  - `a67fdf5` refactor(store): adiciona resetStore para isolar testes unitários
  - `368afdb` feat(auth): implementa registro, login e testes unitários
  - `63aa5b5` feat(ticket): implementa claim, status, consumo e testes unitários
  - `4766eb1` feat(seat): implementa listagem, reserva e testes unitários
- Push com `--force-with-lease` — hashes local e remoto verificados e iguais

**Resultado:** 20 testes passando. 4 commits publicados e visíveis no GitHub web.

---

## Etapa 3 — Backend HTTP (Rotas Express) (2026-04-06)

**Pedido do usuário:**
- Criar rotas HTTP para auth, ticket e seat
- Criar servidor Express integrado
- Manter simples, sem auth complexa, sem frontend nesta etapa
- Commits separados por responsabilidade, publicados no remoto

**Resposta da IA:**
- Criou `auth.routes.ts`: POST `/api/auth/register` (201/400/409), POST `/api/auth/login` (200/401)
- Criou `ticket.routes.ts`: GET `/api/ticket/status` (200), POST `/api/ticket/claim` (201/400/404)
- Criou `seat.routes.ts`: GET `/api/seats` (200), POST `/api/seats/:id/reserve` (200/400/404)
- Criou `index.ts`: Express na porta 3001 com CORS e JSON parsing
- 5 commits separados (3 rotas + 1 server + 1 docs), todos publicados no remoto com verificação de hash

**Resultado:** API REST funcional com 6 rotas. 20 testes ainda passando.

---

## Etapa 4 — Frontend Base + Integração com Backend (2026-04-06)

**Pedido do usuário:**
- Criar estrutura inicial do frontend em React + TypeScript + Vite
- Páginas: LoginPage, RegisterPage, CinemaPage
- Componentes: SeatMap, Seat, Screen
- Camada de API para consumir o backend
- Integrar cadastro, login, pegar ticket, listar poltronas, reservar poltrona
- Login simples com `{ id, username }` salvo em localStorage
- Visual dark theme premium com vermelho como cor principal
- Referência visual usada como base estética apenas (adaptada ao escopo real)
- Sem elementos da referência que não fazem parte do projeto (VIP, preço, filme, etc.)
- Commits pequenos separados por responsabilidade, publicados no remoto

**Resposta da IA:**
- Criou estrutura: index.html, package.json, tsconfig.json, vite.config.ts
- Criou `main.tsx`, `App.tsx` com roteamento por estado
- Criou `AuthContext.tsx` com login/logout/localStorage
- Criou `api/client.ts` com fetch wrapper para todas as 6 rotas da API
- Criou `LoginPage` e `RegisterPage` com card escuro, botão vermelho, campos username/password
- Criou `CinemaPage` com header, botão "Pegar ticket", SeatMap, Screen, legenda de cores
- Criou `Seat` (botão com 3 estados visuais), `SeatMap` (grid 6x8), `Screen` (faixa TELA)
- Criou `global.css` com dark theme premium: dark background, vermelho primário, inputs estilizados

**Resultado:** Frontend completo integrado com backend. 5 commits publicados no remoto.

---

## Etapa 5 — CI/CD com GitHub Actions (2026-04-06)

**Pedido do usuário:**
- Criar workflow `.github/workflows/ci-cd.yml` com 4 jobs
- Jobs `test` e `build` em paralelo, `deploy` apos ambos, `notify` com `if: always()`
- Gerar artifacts: test-results, frontend-dist, backend-package
- Deploy via GitHub Release com artifacts anexados
- Notificacao via `${{ secrets.WEBHOOK_URL }}` condicional, sem hardcode
- Gerar e versionar `package-lock.json` para permitir `npm ci`
- Atualizar `docs/devlog.md`, `docs/ia-prompts.md`, `docs/estrutura-do-projeto.md`
- Commits separados por responsabilidade, publicados no remoto

**Resposta da IA:**
- Criou `.github/workflows/ci-cd.yml` com 4 jobs definidos: test, build, deploy, notify
- `test` e `build` rodam em paralelo; `deploy` depende de ambos; `notify` com `if: always()`
- Artifacts: `test-results` (coverage), `frontend-dist` (vite build), `backend-package` (backend sem node_modules)
- Gerou e versionou `backend/package-lock.json` e `frontend/package-lock.json` para `npm ci`

**Correções aplicadas durante a etapa (registradas em iterações separadas):**

1. *Import incorreto* (`RegisterPage.tsx` importava `register` em vez de `registerReq`) — falha no build do frontend
2. *Empacotamento do backend* — `tar` com `--exclude` dentro de `backend/` falhava no runner. Solução: copiar arquivos para `/tmp/backend-pkg/` e gerar tar sem excludes. Aplicado em múltiplos commits até estabilizar
3. *Permissão da release* — erro `Resource not accessible by integration`. Adicionado `permissions: contents: write` no topo do workflow
4. *Anexos da release* — paths como `test-results/.` não apontavam arquivos. Solução: baixar em `release-assets/`, compactar em `.tar.gz`, anexar arquivos reais

**Exigências do usuário durante a etapa:**
- Verificar cada run real do GitHub Actions via API, não assumir sucesso
- Não considerar etapa concluída sem todos os 4 jobs verdes no GitHub web
- Conferir hash local = remoto após cada push

**Resultado final:** Pipeline com 4/4 jobs verdes (test, build, deploy, notify). Release `v1.0.0-ci` criada com 3 artifacts. Documentação atualizada em todos os arquivos de `docs/`.

---

## Etapa 5.1 — Correções do CI/CD até Pipeline Verde (2026-04-06)

### Correções aplicadas durante a etapa

1. **Import incorreto** (`RegisterPage.tsx` importava `register` em vez de `registerReq`) — falha no build do frontend

2. **Empacotamento do backend** — `tar` com `--exclude` dentro de `backend/` falhava no runner. Solução: copiar arquivos para `/tmp/backend-pkg/` e gerar tar sem excludes. Aplicado em múltiplos commits até estabilizar

3. **Permissão da release** — erro `Resource not accessible by integration`. Adicionado `permissions: contents: write` no topo do workflow

4. **Anexos da release** — paths como `test-results/.` não apontavam arquivos. Solução: baixar em `release-assets/`, compactar em `.tar.gz`, anexar arquivos reais

5. **Simplificação do tar do backend** — versão final usando `tar czf backend-package.tar.gz -C backend src package.json package-lock.json tsconfig.json`, eliminando a abordagem complexa com cp para /tmp

### Exigências do usuário durante a etapa
- Verificar cada run real do GitHub Actions via API, não assumir sucesso
- Não considerar etapa concluída sem todos os 4 jobs verdes no GitHub web
- Conferir hash local = remoto após cada push

### Validação final
- Run #13 do GitHub Actions: `conclusion: success`
- 4/4 jobs verdes: test ✅, build ✅, deploy ✅, notify ✅
- Hash confirmado: local `54164fa` = remoto `54164fa`
- Release `v1.0.0-ci` criada com 3 artifacts

---

## Etapa 6 — Documentação Final (2026-04-06)

**Pedido do usuário:**
- Criar `README.md` na raiz com: objetivo, funcionalidades, arquitetura, pastas, como rodar, como testar, testes, CI/CD, observações
- Atualizar `docs/devlog.md`, `docs/ia-prompts.md`, `docs/estrutura-do-projeto.md`
- Foco em clareza para o professor testar sem dificuldade
- Sem alterar backend, frontend, workflow ou testes
- 1-2 commits, publicados no remoto

**Resposta da IA:**
- Criado `README.md` completo com 9 seções: objetivo, funcionalidades, arquitetura, estrutura, como rodar, como testar, testes, CI/CD, observações
- Atualizado `devlog.md` com registro da validação final da Etapa 5 e da Etapa 6
- Atualizado `ia-prompts.md` com registro detalhado das correções da Etapa 5 e da Etapa 6
- Atualizado `estrutura-do-projeto.md` removendo marcadores "a criar" e adicionando `README.md`

**Resultado:** Documentação completa e coerente. Repositório pronto para avaliação.
