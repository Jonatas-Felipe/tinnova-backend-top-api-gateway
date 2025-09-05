# TOP API Gateway

> API responsável pelo roteamento e acesso aos microserviços da plataforma.

## 📜 Sobre o Projeto

Esta aplicação faz parte de uma arquitetura distribuída e sua principal responsabilidade é ser o gateway que conecta todos os microserviços.

A aplicação é construída com [NestJS](https://nestjs.com/).

## 🚀 Como Rodar (Localmente)

Siga os passos abaixo para configurar e executar o serviço em seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v20.x ou superior)
- [Yarn](https://yarnpkg.com/) (ou `npm`)

### 1. Clonar o Repositório

```bash
git clone https://github.com/Jonatas-Felipe/tinnova-backend-top-api-gateway.git
cd tinnova-backend-top-api-gateway
```

### 2. Instalar as Dependências

```bash
yarn install
```

### 3. Configurar o Ambiente

Crie uma cópia do arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

Agora, abra o arquivo `.env` e preencha as variáveis necessárias.

### 4. Executar o Serviço

Para iniciar a aplicação em modo de desenvolvimento com hot-reload:

```bash
yarn start:dev
```

A API estará disponível em `http://localhost:[porta_definida_no_env]`.

---

## ✅ Testes (NestJS)

A suíte de testes é construída sobre o framework [Jest](https://jestjs.io/) dentro do [NestJS](https://nestjs.com/).

### Como Rodar os Testes

- **Para rodar todos os testes e2e:**
  ```bash
  yarn test:e2e
  ```