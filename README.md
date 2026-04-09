# Cinema App

Sistema web simples de reserva de poltronas para cinema, desenvolvido como atividade acadêmica de CI/CD.

## Funcionalidades

- Cadastro e login de usuários
- Claim de ticket antes da reserva
- Mapa interativo com 48 poltronas
- Reserva de poltrona com consumo automático do ticket
- Persistência simples em `backend/data.json`
- O arquivo é criado automaticamente no backend se ainda não existir

## Arquitetura

| Camada | Tecnologia | Ambiente local | Produção |
|--------|------------|----------------|----------|
| Frontend | React + TypeScript + Vite | `http://localhost:5173` | GitHub Pages |
| Backend | Node.js + Express + TypeScript | `http://localhost:3001` | Render |
| Persistência | arquivo JSON | `backend/data.json` | `backend/data.json` gerado ou reutilizado em runtime |
| Automação | GitHub Actions | CI/CD + Pages deploy | CI/CD + Pages deploy |

## URLs públicas

- Frontend esperado após ativar o Pages: `https://pedrornogueira.github.io/Np1C14/`
- Status real em 2026-04-09: essa URL ainda retorna `404` no GitHub Pages
- Status real em 2026-04-09: ainda não existe URL pública verificada para o backend no Render

## Estrutura do projeto

```text
NP1C14/
|-- .github/workflows/
|   |-- ci-cd.yml
|   `-- deploy-pages.yml
|-- backend/
|   |-- src/
|   |-- tests/
|   |-- data.json
|   |-- package.json
|   `-- tsconfig.json
|-- frontend/
|   |-- src/
|   |-- .env.example
|   |-- package.json
|   `-- vite.config.ts
|-- docs/
|   |-- devlog.md
|   |-- estrutura-do-projeto.md
|   `-- ia-prompts.md
|-- render.yaml
`-- README.md
```

## Como rodar localmente

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend local: `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local: `http://localhost:5173`

Em desenvolvimento, o Vite continua usando proxy de `/api` para `http://localhost:3001`.

## Como publicar o frontend no GitHub Pages

O repositório já ficou preparado com o workflow [`.github/workflows/deploy-pages.yml`](/c:/Users/petru/Desktop/NP1C14/.github/workflows/deploy-pages.yml), que publica automaticamente a pasta `frontend/dist` no GitHub Pages a partir da `main`.

### O que foi ajustado

- `frontend/vite.config.ts` usa `base: /Np1C14/` em produção
- o frontend lê `VITE_API_URL` para apontar para a API publicada
- em desenvolvimento, o fallback continua sendo `/api`
- o workflow usa `configure-pages`, `upload-pages-artifact` e `deploy-pages`

### Configuração mínima no GitHub

1. Acesse `Settings > Pages`.
2. Em `Build and deployment`, deixe a fonte como `GitHub Actions`.
3. Depois que o backend existir no Render, configure a variável de repositório `VITE_API_URL` em `Settings > Secrets and variables > Actions > Variables`.
4. Depois disso, basta fazer push na `main` ou executar manualmente o workflow `Deploy Frontend to GitHub Pages`.

## Como publicar o backend no Render

O repositório já ficou preparado com [`render.yaml`](/c:/Users/petru/Desktop/NP1C14/render.yaml) para facilitar a criação do serviço a partir do GitHub.

### Configuração preparada

- Tipo de serviço: `Web Service` com runtime `Node`
- Docker: não é usado
- Nome sugerido do serviço: `cinema-app-backend-pedrornogueira`
- Root directory: `backend`
- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Branch: `main`
- Porta pública: `process.env.PORT` fornecida pelo Render
- Host público: `0.0.0.0`
- Versão de Node: definida em [`backend/package.json`](/c:/Users/petru/Desktop/NP1C14/backend/package.json) via `engines.node`
- Variáveis de ambiente obrigatórias: nenhuma
- Variável opcional: `DATA_FILE_PATH` para mover o `data.json` para outro caminho

### Passo manual mínimo no Render

1. No Render, crie um novo serviço Web a partir do repositório `PedroRNogueira/Np1C14`.
2. Se o Render detectar o `render.yaml`, confirme a criação do blueprint.
3. Se o nome sugerido estiver disponível, mantenha `cinema-app-backend-pedrornogueira`.
4. Após o primeiro deploy, copie a URL pública real do serviço.
5. Configure essa URL com `/api` no final em `VITE_API_URL` no GitHub e rode novamente o deploy do Pages.

## Como configurar a URL do backend no frontend

O frontend já suporta `VITE_API_URL`.

- Exemplo local de referência: [`frontend/.env.example`](/c:/Users/petru/Desktop/NP1C14/frontend/.env.example)
- Valor esperado em produção: `https://<seu-servico-render>.onrender.com/api`
- Lugar recomendado no GitHub: `Settings > Secrets and variables > Actions > Variables`

Comportamento atual:

- desenvolvimento: usa `/api` e o proxy do Vite
- produção: usa `VITE_API_URL`
- produção sem variável: o build funciona, mas as chamadas da API falham de forma explícita até a variável ser preenchida

## Persistência de dados no Render

O backend continua usando `backend/data.json`. Isso funciona normalmente no ambiente do serviço durante a execução do processo.

Observação importante:

- no Render sem disco persistente, o conteúdo do arquivo pode ser perdido em reinícios, novos deploys ou troca de instância
- se você precisar persistência entre deploys, o código já aceita `DATA_FILE_PATH` para apontar o arquivo para um caminho persistente configurado na plataforma

## Validação real do backend para produção

Dentro de [`backend/`](/c:/Users/petru/Desktop/NP1C14/backend), foi validado:

- `npm ci`
- `npm run build`
- `npm run start`
- `npm run start` com `PORT=10000` para simular o Render

Resultado:

- `npm run build` gerou `dist/`
- `npm run start` subiu o servidor compilado com sucesso
- localmente, sem `PORT`, o backend respondeu em `http://127.0.0.1:3001/api/seats`
- com `PORT=10000`, o backend respondeu em `http://127.0.0.1:10000/api/seats`
- isso deixa o backend compatível com Render Web Service Node sem Docker

## CI/CD

O repositório passa a ter dois fluxos complementares:

- [`ci-cd.yml`](/c:/Users/petru/Desktop/NP1C14/.github/workflows/ci-cd.yml): testes, build e release de artefatos
- [`deploy-pages.yml`](/c:/Users/petru/Desktop/NP1C14/.github/workflows/deploy-pages.yml): deploy automático do frontend no GitHub Pages

## Ações manuais mínimas que ainda dependem de você

- confirmar `GitHub Actions` em `Settings > Pages`
- criar o serviço do backend no Render a partir do repositório
- copiar a URL final do backend no Render
- preencher `VITE_API_URL` no GitHub com essa URL seguida de `/api`

## Testes

```bash
cd backend
npm test
```

## Uso de IA

Este projeto foi desenvolvido com apoio de IA como ferramenta de suporte para arquitetura, implementação, documentação e organização dos commits. O histórico do trabalho está em [`docs/ia-prompts.md`](/c:/Users/petru/Desktop/NP1C14/docs/ia-prompts.md).
