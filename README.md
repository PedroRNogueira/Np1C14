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

- Frontend publicado: `https://pedrornogueira.github.io/Np1C14/`
- Backend sugerido no Render: `https://cinema-app-backend-pedrornogueira.onrender.com/api`
- Se o Render exigir outro nome de serviço, use a URL final dele em `VITE_API_URL`

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
3. Se a URL final do backend for diferente da sugerida neste README, configure a variável de repositório `VITE_API_URL` em `Settings > Secrets and variables > Actions > Variables`.
4. Depois disso, basta fazer push na `main` ou executar manualmente o workflow `Deploy Frontend to GitHub Pages`.

## Como publicar o backend no Render

O repositório já ficou preparado com [`render.yaml`](/c:/Users/petru/Desktop/NP1C14/render.yaml) para facilitar a criação do serviço a partir do GitHub.

### Configuração preparada

- Nome sugerido do serviço: `cinema-app-backend-pedrornogueira`
- Root directory: `backend`
- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Branch: `main`
- Porta: fornecida pela plataforma via `process.env.PORT`
- Variáveis de ambiente obrigatórias: nenhuma
- Variável opcional: `DATA_FILE_PATH` para mover o `data.json` para outro caminho

### Passo manual mínimo no Render

1. No Render, crie um novo serviço Web a partir do repositório `PedroRNogueira/Np1C14`.
2. Se o Render detectar o `render.yaml`, confirme a criação do blueprint.
3. Se o nome sugerido estiver disponível, mantenha `cinema-app-backend-pedrornogueira`.
4. Após o primeiro deploy, confirme a URL pública do serviço.
5. Se a URL final não for `https://cinema-app-backend-pedrornogueira.onrender.com/api`, atualize `VITE_API_URL` no GitHub e rode novamente o deploy do Pages.

## Como configurar a URL do backend no frontend

O frontend já suporta `VITE_API_URL`.

- Exemplo local de referência: [`frontend/.env.example`](/c:/Users/petru/Desktop/NP1C14/frontend/.env.example)
- Valor esperado em produção: `https://<seu-servico-render>.onrender.com/api`
- Lugar recomendado no GitHub: `Settings > Secrets and variables > Actions > Variables`

Comportamento atual:

- desenvolvimento: usa `/api` e o proxy do Vite
- produção: usa `VITE_API_URL` quando configurada
- produção sem variável: usa a URL sugerida do serviço Render definida no código

## Persistência de dados no Render

O backend continua usando `backend/data.json`. Isso funciona normalmente no ambiente do serviço durante a execução do processo.

Observação importante:

- sem disco persistente no Render, o conteúdo do arquivo pode ser perdido em reinícios ou novos deploys
- se você precisar persistência entre deploys, o código já aceita `DATA_FILE_PATH` para apontar o arquivo para um caminho persistente configurado na plataforma

## CI/CD

O repositório passa a ter dois fluxos complementares:

- [`ci-cd.yml`](/c:/Users/petru/Desktop/NP1C14/.github/workflows/ci-cd.yml): testes, build e release de artefatos
- [`deploy-pages.yml`](/c:/Users/petru/Desktop/NP1C14/.github/workflows/deploy-pages.yml): deploy automático do frontend no GitHub Pages

## Ações manuais mínimas que ainda dependem de você

- confirmar `GitHub Actions` em `Settings > Pages`
- criar o serviço do backend no Render a partir do repositório
- conferir a URL final do backend no Render
- preencher `VITE_API_URL` no GitHub apenas se a URL do Render ficar diferente da sugerida

## Testes

```bash
cd backend
npm test
```

## Uso de IA

Este projeto foi desenvolvido com apoio de IA como ferramenta de suporte para arquitetura, implementação, documentação e organização dos commits. O histórico do trabalho está em [`docs/ia-prompts.md`](/c:/Users/petru/Desktop/NP1C14/docs/ia-prompts.md).
