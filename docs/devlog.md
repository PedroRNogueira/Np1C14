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

### Criado
- **`.github/workflows/ci-cd.yml`** — workflow com 4 jobs: test, build, deploy, notify

### Pipeline final funcional

| Job | Paralelismo | Dependências | O que faz |
|-----|-------------|-------------|-----------|
| `test` | roda em paralelo com `build` | nenhuma | `npm ci` + `vitest run --coverage` no backend |
| `build` | roda em paralelo com `test` | nenhuma | `npm run build` no frontend, `tsc --noEmit` no backend, empacotamento do backend |
| `deploy` | sequencial | `needs: [test, build]` | Baixa artifacts, cria GitHub Release `v1.0.0-ci` com 3 anexos |
| `notify` | sequencial | `needs: [test, build, deploy]` + `if: always()` | Consolida status, envia webhook condicional |

### Artifacts gerados
| Artifact | Origem | Formato final na release |
|----------|--------|------------------------|
| `test-results` | `backend/coverage/` | `test-results.tar.gz` |
| `frontend-dist` | `frontend/dist/` | `frontend-dist.tar.gz` |
| `backend-package` | backend copiado sem node_modules | `backend-package.tar.gz` |

### Correções aplicadas durante a etapa
Foram necessárias múltiplas iterações até o pipeline ficar 100% verde:

1. **`RegisterPage` import incorreto** (`f26d182`) — importava `register` mas `client.ts` exporta `registerReq`. Causou falha no `tsc -b` do frontend.

2. **Empacotamento do backend com `tar`** (`78787a0`, `a7f7182`, `f8fd687`) — `tar` com `--exclude` dentro de `backend/` falhava no runner Ubuntu (`exit code 1`). Solução final: copiar arquivos necessários para `/tmp/backend-pkg/` e gerar tar a partir dali, sem excludes.

3. **Permissão para criar release** (`49faa85`) — erro `Resource not accessible by integration`. Adicionado `permissions: contents: write` no topo do workflow para o `GITHUB_TOKEN`.

4. **Anexos da release** (`49faa85`) — `test-results/.` e `frontend-dist/.` não apontavam arquivos reais. Solução: baixar artifacts em diretórios explícitos (`release-assets/`), compactar cada um em `.tar.gz` e anexar apenas arquivos existentes.

### Configurações externas necessárias
- Settings → Actions → General → Workflow permissions → `Read and write permissions`
- Para notificação funcionar: configurar secret `WEBHOOK_URL` no repositório

### Commits da Etapa 5

| Hash | Mensagem |
|------|----------|
| `09585b7` | `build(project): adiciona package-lock para backend e frontend` |
| `09c2f52` | `docs: atualiza documentação da etapa 5` |
| `5897388` | `ci(actions): adiciona workflow de test, build, deploy e notify` |
| `f26d182` | `fix(ci): corrige import incorreto de registro no frontend` |
| `78787a0` | `fix(ci): corrige empacotamento do backend no workflow` |
| `a7f7182` | `fix(ci): substitui tar por cp seletivo no empacotamento do backend` |
| `f8fd687` | `fix(ci): corrige empacotamento do backend com cp + tar simples` |
| `6ca4075` | `fix(ci): reescreve empacotamento do backend com caminhos absolutos` |
| `49faa85` | `fix(ci): adiciona permissoes e corrige anexos da release` |
| `dba8c12` | `docs: corrige documentacao da etapa 5` |

### Resultado final
Pipeline CI/CD funcional com 4/4 jobs verdes: test ✅, build ✅, deploy ✅, notify ✅. Release `v1.0.0-ci` criada com 3 artifacts anexados.

---

## 2026-04-06 — Ajustes da Etapa 5: Release e permissões

### Permissões do workflow
- Adicionado `permissions: contents: write` no topo do workflow para `GITHUB_TOKEN` ter acesso de criar releases
- Sem essa permissão, o step `Create GitHub Release` falhava com `Resource not accessible by integration`

### Correção dos anexos reais da release
- `test-results/.` e `frontend-dist/.` não apontavam arquivos reais — download-artifact baixa diretórios, mas o release action espera arquivos
- Solução: baixar artifacts em `release-assets/` com paths explícitos, compactar em `.tar.gz`, anexar apenas arquivos reais:
  - `release-assets/test-results.tar.gz`
  - `release-assets/frontend-dist.tar.gz`
  - `release-assets/backend-package/backend-package.tar.gz`

### Correção final do empacotamento do backend
- Múltiplas iterações até o `tar` do backend funcionar no runner Ubuntu
- Versão final: `tar czf backend-package.tar.gz -C backend src package.json package-lock.json tsconfig.json`
- Hash: `54164fa` — run #13 do GitHub Actions, 4/4 jobs verdes
- Pipeline validado via API do GitHub (`conclusion: success`)

### Resultado final da Etapa 5
Release `v1.0.0-ci` criada com sucesso no GitHub, contendo os 3 artifacts em formato `.tar.gz`. Pipeline com 4/4 jobs verdes: `test` ✅, `build` ✅, `deploy` ✅, `notify` ✅.

---

## 2026-04-06 — Etapa 6: Documentação Final

### Criado
- **`README.md`** — Guia completo do projeto na raiz do repositório:
  - Objetivo e funcionalidades
  - Resumo da arquitetura
  - Explicação de todas as pastas
  - Pré-requisitos e passos para rodar (backend + frontend)
  - Guia de teste prático passo a passo para o professor
  - Instruções de testes unitários
  - Explicação do CI/CD em alto nível
  - Observações sobre limitações intencionais

### Atualizado
- **`docs/devlog.md`** — Registro da Etapa 5 completa, incluindo validação final e correções do pipeline
- **`docs/ia-prompts.md`** — Registro completo da Etapa 5 com correções e validação
- **`docs/estrutura-do-projeto.md`** — Sincronizado com arquivos existentes, removidos marcadores "a criar"

### Resultado
Documentação completa e coerente. Repositório pronto para avaliação.

---

## 2026-04-09 — Etapa 7: Deploy Público (GitHub Pages + Render)

### Frontend
- `frontend/vite.config.ts` ajustado para `base: /Np1C14/` em produção
- `frontend/src/api/client.ts` ajustado para ler `VITE_API_URL`
- fallback local mantido em desenvolvimento com `/api`
- criado `frontend/src/vite-env.d.ts` para tipagem de `import.meta.env`
- criado `frontend/.env.example` com exemplo da URL pública da API
- criado `.github/workflows/deploy-pages.yml` para deploy automático do frontend no GitHub Pages

### Backend
- `backend/src/index.ts` ajustado para usar `process.env.PORT`
- `backend/package.json` ganhou `build`, `check` e `start` voltados ao deploy
- `backend/src/store/data.store.ts` passou a aceitar `DATA_FILE_PATH` opcional e garante a criação do diretório do arquivo
- criado `render.yaml` com serviço web Node apontando para `backend/` na branch `main`
- `ci-cd.yml` atualizado para empacotar o backend compilado (`dist`) para o artifact de release

### Documentação
- `README.md` atualizado com URLs públicas, fluxo de deploy e ações manuais mínimas
- `docs/estrutura-do-projeto.md` atualizado com `render.yaml`, workflow do Pages e arquivos de ambiente
- `docs/ia-prompts.md` atualizado com o registro desta etapa

### Resultado
Projeto preparado para deploy público completo:
- frontend pronto para GitHub Pages
- backend pronto para Render
- integração frontend ↔ backend pronta via `VITE_API_URL`
- auto deploy do frontend preparado a partir da `main`

### Dependências manuais remanescentes
- confirmar `Settings > Pages` com fonte `GitHub Actions`
- criar o serviço no Render usando o repositório público
- confirmar a URL final do backend e ajustar `VITE_API_URL` apenas se necessário

---

## 2026-04-09 — Verificação real dos deploys públicos

### Validação externa
- `git status` limpo em `main`
- hash local e remoto iguais em `9e339507d2b445779c5e367e5d8251022ce00328`
- workflow `CI/CD Pipeline` no GitHub Actions concluído com `success`
- workflow `Deploy Frontend to GitHub Pages` no GitHub Actions concluiu com `failure`
- a falha ocorreu no step `Configure GitHub Pages`
- `https://pedrornogueira.github.io/Np1C14/` retorna `404`
- `https://cinema-app-backend-pedrornogueira.onrender.com/api/seats` retorna `404`

### Correção aplicada após a verificação
- removida a URL de produção não verificada do frontend
- `frontend/src/api/client.ts` agora exige `VITE_API_URL` em produção, sem quebrar o build
- `frontend/.env.example` virou placeholder genérico
- `README.md` atualizado para refletir o estado real publicado e o passo externo necessário

### Conclusão objetiva
- o frontend está tecnicamente pronto para publicar, mas depende de `Settings > Pages > Source = GitHub Actions`
- o backend está tecnicamente pronto para publicar, mas depende da criação do serviço no Render
- a URL final de `VITE_API_URL` ainda não pode ser determinada com segurança antes da criação real do serviço no Render

---

## 2026-04-09 — Etapa 8: Ajuste final do backend para Render Node sem Docker

### Problema identificado
- o backend já compilava e iniciava, mas ainda faltava explicitar no código o bind em `0.0.0.0`
- a versão de Node usada pelo serviço estava implícita no Render, sem trava no próprio backend
- a documentação ainda não deixava explícito que o serviço alvo é `Web Service` Node sem Docker

### Ajustes aplicados
- `backend/package.json` ganhou `engines.node` com faixa compatível de produção para o Render
- `backend/src/index.ts` passou a bindar em `0.0.0.0` com `process.env.PORT` e fallback local `3001`
- `render.yaml` foi simplificado para manter o serviço como `type: web`, `runtime: node`, `rootDir: backend`, `buildCommand: npm ci && npm run build` e `startCommand: npm run start`
- `README.md`, `docs/ia-prompts.md` e `docs/estrutura-do-projeto.md` foram atualizados com o fluxo real do backend no Render

### Validação local obrigatória
- `npm ci` executado em `backend/`
- `npm run build` executado em `backend/`
- `npm run start` executado em `backend/` com resposta `200` em `http://127.0.0.1:3001/api/seats`
- `npm run start` também validado com `PORT=10000`, retornando `200` em `http://127.0.0.1:10000/api/seats`

### Conclusão
- backend pronto para `Render Web Service Node` sem Docker
- único passo manual restante: criar o serviço no painel do Render usando o repositório e confirmar o blueprint
