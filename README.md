# TelecomOS

Sistema mobile (Expo / React Native) para provedores de internet: gestão de clientes e ordens de serviço, com API REST própria e banco MySQL.

## Estrutura do repositório
| Pasta | Conteúdo |
|---|---|
| `/` (raiz) | Aplicativo Expo + Expo Router (`src/app`, `src/components`, ...) |
| `api/` | API REST em Node.js + Express, com autenticação JWT e documentação Swagger |
| `database/` | Script SQL do banco MySQL (`schema.sql`) |
| `docs/` | Relatórios dos checkpoints |

## Como executar
Requisitos: Node.js 20.6+ e MySQL 8.

**1. Banco e API**
```
cd api
cp .env.example .env      # preencha DB_PASSWORD e JWT_SECRET
npm install
npm run db:setup          # cria o banco "telecomos", as tabelas e dados de exemplo
npm start                 # http://localhost:3000  (Swagger em /docs)
```

**2. Aplicativo** (na raiz do repositório)
```
npm install
npx expo start
```
Na tela de login, crie a primeira conta: ela vira administradora.

Em celular físico (Expo Go), crie um `.env.local` na raiz com o IP do computador na rede:
```
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
```

## Documentação
- [Checkpoint 1](docs/Checkpoint1.md)
- [Checkpoint 2](docs/Checkpoint2.md): navegação e integração com a Web API REST
