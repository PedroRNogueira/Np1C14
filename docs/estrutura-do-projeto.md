# Estrutura do Projeto

Raiz do projeto: `NP1C14/`

```
NP1C14/
├── .git/                          # Repositório Git (raiz)
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # Pipeline CI/CD (a criar)
│
├── backend/                       # Backend — Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts               # Entry point, servidor Express (a criar)
│   │   ├── routes/                # Rotas HTTP (a criar)
│   │   ├── services/              # Regras de negócio (implementar)
│   │   │   ├── auth.service.ts    # Cadastro e login
│   │   │   ├── ticket.service.ts  # Claim e status de ticket
│   │   │   └── seat.service.ts    # Mapa e reserva de poltronas
│   │   ├── store/
│   │   │   └── data.store.ts      # Persistência em memória + data.json
│   │   └── types/
│   │       └── index.ts           # Interfaces TypeScript
│   ├── tests/
│   │   ├── auth.test.ts           # Testes unitários de auth (a criar)
│   │   ├── ticket.test.ts         # Testes unitários de ticket (a criar)
│   │   └── seat.test.ts           # Testes unitários de seat (a criar)
│   ├── data.json                  # Persistência local (gerado em runtime)
│   ├── package.json               # Dependências do backend
│   ├── tsconfig.json              # Configuração TypeScript
│   └── vitest.config.ts           # Configuração Vitest
│
├── frontend/                      # Frontend — React + TypeScript + Vite (a criar)
│   ├── src/
│   ├── tests/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docs/                          # Documentação do uso de IA
│   ├── ia-prompts.md              # Registro de prompts e respostas
│   ├── devlog.md                  # Diário técnico do projeto
│   └── estrutura-do-projeto.md    # Este arquivo
│
├── README.md                      # Documentação principal (a criar)
└── C14_TESTES_CICD.pdf            # Enunciado da atividade acadêmica
```

## Descrição das Pastas

| Pasta | Função |
|-------|--------|
| `backend/src/types/` | Interfaces TypeScript (User, Ticket, Seat, StoreData) |
| `backend/src/store/` | Acesso aos dados em memória e persistência em `data.json` |
| `backend/src/services/` | Regras de negócio puras (testáveis unitariamente) |
| `backend/src/routes/` | Roteadores Express que chamam os services |
| `backend/tests/` | Testes unitários dos services com Vitest |
| `frontend/` | Aplicação React (a criar) |
| `.github/workflows/` | Pipeline CI/CD do GitHub Actions (a criar) |
| `docs/` | Documentação de uso de IA e decisões do projeto |
