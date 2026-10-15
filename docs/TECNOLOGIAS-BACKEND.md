# Justificativa das Tecnologias do Back-End — Agenda-MEI

Este documento registra a fundamentação técnica das escolhas de arquitetura, linguagem, framework, banco de dados e bibliotecas adotadas para a construção da API REST do **Agenda-MEI**, no contexto da disciplina de Desenvolvimento de Software.

---

## 1. Visão Geral da Arquitetura

O **Agenda-MEI** é um sistema voltado para Microempreendedores Individuais (MEI), projetado para simplificar o controle de agendamentos, catálogo de serviços prestados e carteira de clientes.

Para atender aos requisitos acadêmicos e garantir manutenibilidade, escalabilidade e facilidade de deploy, foi adotada uma arquitetura desacoplada em camadas:

```
[ Front-End: React + Vite + Tailwind ]
                  │
                  ▼ (HTTP/REST via JSON + JWT)
[ Camada de Rotas (Express Router) ]
                  │
                  ▼ (Validação de Dados com Zod)
[ Camada de Controladores (Controllers) ]
                  │
                  ▼ (Regras de Negócio)
[ Camada de Serviços (Services) ]
                  │
                  ▼ (Pool de Conexões SQL Parametrizado)
[ Banco de Dados: PostgreSQL ]
```

---

## 2. Tecnologias Escolhidas e Justificativas

### 2.1. Plataforma: Node.js (v18+)
- **Justificativa:** Plataforma de execução assíncrona orientada a eventos (*event-driven* e I/O não bloqueante), amplamente adotada na indústria para APIs REST. Compartilha o ecossistema JavaScript com o front-end, reduzindo a sobrecarga cognitiva e permitindo reaproveitamento de tipagens e modelos conceituais.
- **Benefício:** Inicialização rápida, baixo consumo de memória e ecossistema maduro via `npm`.

### 2.2. Linguagem: TypeScript
- **Justificativa:** Adiciona tipagem estática e interfaces em tempo de desenvolvimento sobre o JavaScript.
- **Benefício:** Evita erros comuns de execução (*undefined is not a function*, propriedades ausentes), melhora a legibilidade do código, fornece autocompletar consistente e formaliza os contratos de dados (DTOs, entidades e parâmetros de requisição).

### 2.3. Framework Web: Express (v4/v5)
- **Justificativa:** Framework web minimalista, estável e amplamente documentado no ecossistema Node.js.
- **Benefício:** Flexibilidade total para configurar pipelines de middlewares (autenticação JWT, tratamento centralizado de erros, CORS e validação de esquemas), sem impor complexidade desnecessária ou convenções rígidas que poderiam atrapalhar a auditoria e correção acadêmica.

### 2.4. Banco de Dados: PostgreSQL
- **Justificativa:** Sistema Gerenciador de Banco de Dados Relacional (SGBDR) robusto, de código aberto, com conformidade estrita com as propriedades ACID (Atomicidade, Consistência, Isolamento e Durabilidade).
- **Benefício:** O modelo de dados do MEI é inerentemente relacional (um usuário MEI possui muitos clientes, muitos serviços e muitos agendamentos vinculados a clientes e serviços específicos). A integridade referencial via chaves estrangeiras (`ON DELETE CASCADE` / `RESTRICT`) e constraints `CHECK` garantem a consistência dos dados financeiros e de agenda.

### 2.5. Driver de Banco: `pg` (node-postgres com Connection Pool)
- **Justificativa:** Driver nativo e de alta performance para PostgreSQL.
- **Benefício:** Gerenciamento eficiente de conexões via `Pool`, execução de consultas SQL nativas e parametrizadas (prevenção absoluta contra SQL Injection) e ausência da complexidade oculta e problemas de performance de ORMs pesados em projetos com prazo delimitado.

### 2.6. Validação de Dados: Zod
- **Justificativa:** Biblioteca de declaração e inferência de esquemas TypeScript (*schema validation*).
- **Benefício:** Valida as requisições (`req.body`, `req.query`, `req.params`) antes que cheguem aos controladores, retornando erros detalhados e amigáveis para o cliente (ex.: senhas curtas, CNPJ inválido, campos obrigatórios ausentes), blindando o sistema contra payloads maliciosos ou corrompidos.

### 2.7. Autenticação e Criptografia: `bcryptjs` e `jsonwebtoken` (JWT)
- **Justificativa:** 
  - `bcryptjs`: Implementação pura em JavaScript do algoritmo de hash de senhas Blowfish com salteamento dinâmico (*salt rounds*). Evita problemas de compilação C++ nativa no Windows e garante que nenhuma senha seja persistida em texto puro.
  - `jsonwebtoken`: Padrão aberto da indústria (RFC 7519) para autenticação *stateless*. Emite tokens compactos assinados com chave secreta (`JWT_SECRET`) que trafegam com segurança no cabeçalho `Authorization: Bearer <token>`.

### 2.8. Segurança Adicional: CORS e Variáveis de Ambiente
- **CORS (`cors`):** Restringe o acesso aos endpoints apenas para as origens autorizadas (como `http://localhost:5173` do Vite), prevenindo requisições não autorizadas a partir de domínios maliciosos.
- **Dotenv (`dotenv`):** Segregação estrita entre código-fonte e configurações sensíveis. Segredos, chaves de assinatura e credenciais de banco de dados permanecem em arquivos `.env` ignorados pelo Git, documentados através de `.env.example`.

---

## 3. Estrutura de Camadas Adotada

- **`config/`**: Inicialização de variáveis de ambiente (`env.ts`) e pool do banco de dados (`db.ts`), incluindo verificação de integridade (*health check*).
- **`middlewares/`**: Validação com Zod (`validateRequest.ts`), proteção por token (`authMiddleware.ts`) e tratamento global de erros (`errorHandler.ts`).
- **`controllers/`**: Extração de parâmetros HTTP, chamada de serviços e envio de respostas com códigos HTTP adequados (200, 201, 400, 401, 404, 409, 503).
- **`services/`**: Concentração da lógica de negócio e queries parametrizadas no PostgreSQL.
- **`routes/`**: Definição declarativa dos caminhos e associação de middlewares e controladores.
- **`db/`**: Scripts DDL de criação de tabelas, chaves e índices (`schema.sql`).

---

## 4. Conclusão

A combinação de **Node.js, TypeScript, Express e PostgreSQL** proporciona uma base moderna, segura, performática e plenamente alinhada com as melhores práticas de Engenharia de Software para a atividade acadêmica e futuras expansões do **Agenda-MEI**.
