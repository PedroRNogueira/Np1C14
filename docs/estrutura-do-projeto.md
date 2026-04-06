# Estrutura do Projeto

Raiz do projeto: `NP1C14/`

```
NP1C14/
├── .git/                          # Repositório Git (raiz)
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # Pipeline CI/CD ✅
│
├── backend/                       # Backend — Node.js + Express + TypeScript ✅
│   ├── src/
│   │   ├── index.ts               # Entry point, servidor Express ✅
│   │   ├── routes/                # Rotas HTTP ✅
│   │   │   ├── auth.routes.ts     # Cadastro e login ✅
│   │   │   ├── ticket.routes.ts   # Claim e status de ticket ✅
│   │   │   └── seat.routes.ts     # Listagem e reserva de poltronas ✅
│   │   ├── services/              # Regras de negócio ✅
│   │   │   ├── auth.service.ts    # Cadastro e login ✅
│   │   │   ├── ticket.service.ts  # Claim e status de ticket ✅
│   │   │   └── seat.service.ts    # Mapa e reserva de poltronas ✅
│   │   ├── store/
│   │   │   └── data.store.ts      # Persistência em memória + data.json ✅
│   │   └── types/
│   │       └── index.ts           # Interfaces TypeScript ✅
│   ├── tests/
│   │   ├── auth.test.ts           # Testes unitários de auth ✅
│   │   ├── ticket.test.ts         # Testes unitários de ticket ✅
│   │   └── seat.test.ts           # Testes unitários de seat ✅
│   ├── data.json                  # Persistência local (gerado em runtime)
│   ├── package-lock.json          # Lock de deps do backend ✅
│   ├── package.json               # Dependências do backend ✅
│   ├── tsconfig.json              # Configuração TypeScript ✅
│   └── vitest.config.ts           # Configuração Vitest ✅
│
├── frontend/                      # Frontend — React + TypeScript + Vite ✅
│   ├── src/
│   │   ├── main.tsx               # Entry point React ✅
│   │   ├── App.tsx                # Roteamento por estado ✅
│   │   ├── api/
│   │   │   └── client.ts          # Fetch wrapper ✅
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Estado de autenticação ✅
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx      # Tela de login ✅
│   │   │   ├── RegisterPage.tsx   # Tela de cadastro ✅
│   │   │   └── CinemaPage.tsx     # Tela da sala ✅
│   │   ├── components/
│   │   │   ├── SeatMap.tsx        # Grid de poltronas ✅
│   │   │   ├── Seat.tsx           # Poltrona individual ✅
│   │   │   └── Screen.tsx         # Faixa "TELA" ✅
│   │   └── styles/
│   │       └── global.css         # Estilos globais ✅
│   ├── index.html                 # Shell HTML ✅
│   ├── package-lock.json          # Lock de deps do frontend ✅
│   ├── package.json               # Dependências do frontend ✅
│   ├── tsconfig.json              # Configuração TypeScript ✅
│   └── vite.config.ts             # Configuração Vite ✅
│
├── docs/                          # Documentação do uso de IA ✅
│   ├── ia-prompts.md              # Registro de prompts e respostas ✅
│   ├── devlog.md                  # Diário técnico do projeto ✅
│   └── estrutura-do-projeto.md    # Este arquivo ✅
│
├── README.md                      # Documentação principal (a criar)
└── C14_TESTES_CICD.pdf            # Enunciado da atividade acadêmica
```

## Descrição das Pastas

| Pasta | Função |
|-------|--------|
| `.github/workflows/` | Pipeline CI/CD do GitHub Actions (test, build, deploy, notify) |
| `backend/src/types/` | Interfaces TypeScript (User, Ticket, Seat, StoreData) |
| `backend/src/store/` | Acesso aos dados em memória e persistência em `data.json` |
| `backend/src/services/` | Regras de negócio puras (testáveis unitariamente) |
| `backend/src/routes/` | Roteadores Express que chamam os services |
| `backend/tests/` | Testes unitários dos services com Vitest (20 testes) |
| `frontend/src/api/` | Camada de comunicação com o backend |
| `frontend/src/context/` | Estado global (autenticação) |
| `frontend/src/pages/` | Páginas da aplicação (login, cadastro, cinema) |
| `frontend/src/components/` | Componentes reutilizáveis (SeatMap, Seat, Screen) |
| `docs/` | Documentação de uso de IA e decisões do projeto |
