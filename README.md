# Agenda-MEI 📋💼

Sistema integrado de gestão de compromissos, carteira de clientes e catálogo de serviços desenvolvido especificamente para **Microempreendedores Individuais (MEI)**. 

O projeto conta com interface web moderna desenvolvida a partir de protótipo no Figma e uma arquitetura back-end em camadas (Node.js + Express + TypeScript + PostgreSQL) preparada para suportar a persistência relacional e autenticação segura da aplicação.

---

## 🛠️ Tecnologias Utilizadas

### Front-End
- **Biblioteca Base:** [React 18](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
- **Ferramenta de Build:** [Vite 6](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes & Ícones:** [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Camada de Serviços HTTP:** Fetch API encapsulada com injeção automática de Bearer Token e tipagens de dados

### Back-End
- **Plataforma:** [Node.js](https://nodejs.org/) (v18+) com [TypeScript](https://www.typescriptlang.org/)
- **Framework Web:** [Express](https://expressjs.com/) (v4/v5)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (driver `pg` com pool de conexões)
- **Autenticação & Criptografia:** [JWT (jsonwebtoken)](https://jwt.io/) e [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Validação de Esquemas:** [Zod](https://zod.dev/)
- **Configuração:** [dotenv](https://www.npmjs.com/package/dotenv) e CORS parametrizado
- **Justificativas Técnicas:** Consulte o documento detalhado em [`docs/TECNOLOGIAS-BACKEND.md`](./docs/TECNOLOGIAS-BACKEND.md)

---

## 📂 Arquitetura de Pastas

```
Agenda-MEI/
├── docs/                               # Documentações técnicas do projeto
│   └── TECNOLOGIAS-BACKEND.md          # Justificativa das escolhas do back-end
├── server/                             # Back-end da aplicação (API REST)
│   ├── .env.example                    # Exemplo de configuração de ambiente da API
│   ├── package.json                    # Dependências e scripts do servidor
│   ├── tsconfig.json                   # Configurações TypeScript do servidor
│   └── src/
│       ├── app.ts                      # Configuração do Express, CORS e rotas
│       ├── index.ts                    # Ponto de entrada e inicialização do servidor
│       ├── config/
│       │   ├── db.ts                   # Pool PostgreSQL e verificador de integridade
│       │   └── env.ts                  # Variáveis de ambiente centralizadas
│       ├── controllers/                # Controladores das requisições HTTP
│       │   ├── appointmentController.ts
│       │   ├── authController.ts
│       │   ├── clientController.ts
│       │   ├── healthController.ts
│       │   ├── serviceController.ts
│       │   └── userController.ts
│       ├── db/
│       │   └── schema.sql              # Esquema DDL do PostgreSQL (tabelas e índices)
│       ├── middlewares/
│       │   ├── authMiddleware.ts       # Validação de token JWT Bearer
│       │   ├── errorHandler.ts         # Tratamento global e seguro de erros
│       │   └── validateRequest.ts      # Validador de esquemas Zod
│       ├── routes/                     # Definição das rotas REST
│       │   ├── appointmentRoutes.ts
│       │   ├── authRoutes.ts
│       │   ├── clientRoutes.ts
│       │   ├── healthRoutes.ts
│       │   ├── index.ts                # Concentrador de rotas sob /api
│       │   ├── serviceRoutes.ts
│       │   └── userRoutes.ts
│       ├── services/                   # Lógica de negócio e queries SQL
│       │   ├── appointmentService.ts
│       │   ├── authService.ts
│       │   ├── clientService.ts
│       │   ├── serviceService.ts
│       │   └── userService.ts
│       ├── types/                      # Interfaces TypeScript das entidades
│       └── validations/                # Esquemas de validação de payload (Zod)
├── src/                                # Front-End da aplicação
│   ├── app/
│   │   ├── App.tsx                     # Componente raiz e gerenciador de estado
│   │   ├── components/                 # Componentes de tela e interface
│   │   │   ├── AgendaCompromissos.tsx  # Tela de gestão de agenda
│   │   │   ├── Cadastro.tsx            # Tela de cadastro do MEI
│   │   │   ├── Clientes.tsx            # Tela de clientes
│   │   │   ├── Dashboard.tsx           # Estrutura principal com Sidebar
│   │   │   ├── GestaoServicos.tsx      # Tela de catálogo de serviços
│   │   │   ├── Login.tsx               # Tela de autenticação
│   │   │   ├── Perfil.tsx              # Tela de perfil e configurações
│   │   │   └── ...
│   │   └── services/                   # Camada de comunicação HTTP com a API
│   │       ├── api.ts                  # Cliente base de requisições e tokens
│   │       ├── appointmentService.ts   # Métodos de agendamentos
│   │       ├── authService.ts          # Métodos de autenticação e perfil
│   │       ├── clientService.ts        # Métodos de clientes
│   │       ├── index.ts
│   │       └── serviceService.ts       # Métodos de serviços
├── .env.example                        # Modelo raiz de variáveis de ambiente
├── .gitignore                          # Exclusões de Git (ignora .env e builds)
├── index.html                          # Ponto de entrada HTML do Vite
├── package.json                        # Dependências e scripts do front-end
├── tsconfig.json                       # Configuração TypeScript do front-end
└── vite.config.ts                      # Configuração do Vite e plugins
```

---

## ⚙️ Pré-requisitos

1. **Node.js** (versão 18.0.0 ou superior instalada)
2. **NPM** (gerenciador de pacotes incluso no Node.js)
3. **PostgreSQL** (versão 14 ou superior instalada localmente ou em nuvem)

---

## 🚀 Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd Agenda-MEI
```

### 2. Configurar o Back-End

#### A. Instalar as dependências do servidor:
```bash
cd server
npm install
cd ..
```

#### B. Criar o arquivo `.env`:
Copie o modelo de variáveis de ambiente:
```bash
# No diretório server/ ou na raiz:
cp server/.env.example server/.env
```

Edite o arquivo `server/.env` preenchendo suas credenciais locais do PostgreSQL:
```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agenda_mei
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres
JWT_SECRET=sua_chave_secreta_longa_aqui
```

#### C. Criar a base de dados no PostgreSQL:
No PostgreSQL (via `psql` ou ferramenta visual como pgAdmin / DBeaver):
```sql
CREATE DATABASE agenda_mei;
```
Em seguida, execute o script DDL com as tabelas e índices em [`server/src/db/schema.sql`](./server/src/db/schema.sql).

#### D. Iniciar o servidor Back-End:
A partir do diretório raiz do projeto:
```bash
npm run server
```
Ou dentro da pasta `server/`:
```bash
cd server
npm run dev
```
O servidor iniciará em `http://localhost:3001`. Você pode testar a integridade acessando `http://localhost:3001/api/health`.

---

### 3. Executar o Front-End

#### A. Instalar as dependências do front-end (se ainda não o fez):
```bash
npm install
```

#### B. Iniciar o servidor de desenvolvimento:
```bash
npm run dev
```
O front-end estará disponível em `http://localhost:5173`.

---

## 📡 Endpoints da API REST

Todas as rotas da API estão sob o prefixo `/api`.

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| `GET` | `/api/health` | Verifica integridade da API e conectividade com o PostgreSQL | Pública |
| `POST` | `/api/auth/register` | Cadastro inicial do usuário MEI | Pública |
| `POST` | `/api/auth/login` | Login do usuário MEI (retorna JWT e dados) | Pública |
| `GET` | `/api/users/profile` | Consulta os dados do perfil do MEI autenticado | Bearer Token |
| `PUT` | `/api/users/profile` | Atualiza os dados do perfil do MEI autenticado | Bearer Token |
| `GET` | `/api/clients` | Lista os clientes cadastrados (suporta busca `?busca=...`) | Bearer Token |
| `GET` | `/api/clients/:id` | Detalhes de um cliente específico | Bearer Token |
| `POST` | `/api/clients` | Cadastra um novo cliente | Bearer Token |
| `PUT` | `/api/clients/:id` | Atualiza dados de um cliente | Bearer Token |
| `DELETE` | `/api/clients/:id` | Remove um cliente (se não tiver agendamentos) | Bearer Token |
| `GET` | `/api/services` | Lista os serviços do catálogo (suporta `?busca=...`) | Bearer Token |
| `GET` | `/api/services/:id` | Detalhes de um serviço específico | Bearer Token |
| `POST` | `/api/services` | Cadastra um novo serviço no catálogo | Bearer Token |
| `PUT` | `/api/services/:id` | Atualiza dados de um serviço | Bearer Token |
| `DELETE` | `/api/services/:id` | Remove um serviço (se não tiver agendamentos) | Bearer Token |
| `GET` | `/api/appointments` | Lista os agendamentos (filtros: `status`, `data`, `clienteId`) | Bearer Token |
| `GET` | `/api/appointments/:id` | Detalhes de um agendamento com dados do cliente e serviço | Bearer Token |
| `POST` | `/api/appointments` | Cria um novo agendamento | Bearer Token |
| `PUT` | `/api/appointments/:id` | Atualiza dados de um agendamento | Bearer Token |
| `PATCH` | `/api/appointments/:id/status`| Atualiza status (`agendado`, `cumprido`, `naoCumprido`) e justificativa | Bearer Token |
| `DELETE` | `/api/appointments/:id` | Cancela/exclui um agendamento | Bearer Token |

---

## 📊 Status de Implementação

### ✅ Funcionalidades Concluídas
- [x] Front-end prototipado com telas de Login, Cadastro, Dashboard, Clientes, Catálogo de Serviços, Agenda e Perfil.
- [x] Estrutura completa do back-end em Node.js + Express + TypeScript com separação de responsabilidades (Rotas, Controladores, Serviços, Configurações e Middlewares).
- [x] Endpoint de monitoramento de saúde da API (`GET /api/health`) com diagnóstico dinâmico de conectividade ao PostgreSQL.
- [x] Script DDL relacional completo (`server/src/db/schema.sql`) com tabelas de usuários, clientes, serviços e agendamentos, constraints `CHECK`, `FOREIGN KEY` e índices.
- [x] Validação estrutural de payloads de entrada via **Zod** para todas as rotas.
- [x] Segurança de credenciais: Hash de senhas via **bcryptjs** (sem senhas em texto puro) e geração de tokens **JWT**.
- [x] Camada de serviços HTTP no front-end (`src/app/services/`) com centralização de chamadas à API e gerenciamento de tokens.
- [x] Arquivos `.env.example` sem dados sensíveis e `.gitignore` devidamente configurado para impedir vazamento de credenciais.

### ⏳ Dependências de Configuração Externa / Pendências Futuras
- [ ] Conexão efetiva do banco de dados PostgreSQL (requer que o operador configure a senha do usuário local no arquivo `.env` e crie a base `agenda_mei`).
- [ ] Transição gradual do armazenamento do front-end (`localStorage`) para consumo exclusivo da API REST via os serviços criados em `src/app/services/` após a ativação do banco de dados.