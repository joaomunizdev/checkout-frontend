# Checkout API

Este guia descreve como executar este projeto utilizando um ambiente de desenvolvimento Docker.

## Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Tecnologias Utilizadas

- **Node.js (v22)**
- **Next.js (16.0.3) (App Router)**
- **Typescript**
- **React (v19.2.0)**
- **ShadCN/UI** (Radix UI + Tailwind CSS)
- **React Context API** para estado global
- **React Hook Form** + **Zod** para formulários e validação
- **Axios** para requisições HTTP
- **Lucide React** e **ZodResolver** para utilidades
- **Docker(v29.0.1^) / Docker Compose(v2.40.3)** para ambiente de desenvolvimento

---

## Arquitetura e Trade-offs

### Gerenciamento de Estado

- _Decisão:_ Usar Context API (CheckoutContext) para o fluxo de checkout.
- _Trade-off:_ Simples e suficiente para um fluxo isolado.

### Busca de Dados

- _Decisão:_ Criar hooks customizados (usePlans, useCoupon, etc.) para encapsular a lógica de fetch.
- _Trade-off:_ Organização e reutilização.

### Componentes de UI

- _Decisão:_ Utilizar ShadCN/UI.
- _Trade-off:_ Total controle sobre os componentes e bundle final.

### Formulários e Validação

- _Decisão:_ React Hook Form + Zod.
- _Trade-off:_ Combinação moderna, performática e robusta, permitindo schemas reutilizáveis entre front e back.  
  Exige uso de duas libs, mas oferece melhor manutenibilidade e confiabilidade.

---

## Guia de Instalação e Execução

Siga estes passos para configurar e levantar o ambiente de desenvolvimento.

### 1. Configurar o Arquivo de Ambiente (.env)

```bash
    cp .env.example .env
```

### 2. Construir e Subir os Contêineres

Com o Docker em execução, execute o seguinte comando na raiz do projeto:

```bash
    docker compose up -d --build
```

### 3. Acesso ao projeto

```bash
    http://localhost:3000
```

### Derrubar projeto

```bash
    docker compose down -v --remove-orphans
```
