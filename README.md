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
Requisitos: Node.js 20.6+ (e MySQL 8 apenas para rodar a API localmente).

**Uso rápido:** a API está publicada no Render (`https://telecomos-api.onrender.com`) e o banco no Aiven. O aplicativo já aponta para ela por padrão: basta `npm install` e `npx expo start` na raiz, sem criar `.env`. As etapas abaixo servem para rodar tudo localmente.

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

Para usar a API local no app, crie um `.env.local` na raiz. Em celular físico (Expo Go), use o IP do computador na rede; no emulador Android, `http://10.0.2.2:3000`:
```
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
```

## Documentação
- [Checkpoint 1](docs/Checkpoint1.md)
- [Checkpoint 2](docs/Checkpoint2.md): navegação e integração com a Web API REST
- [Checkpoint 3](docs/Checkpoint3.md): entrega final, dashboard com dados reais e deploy da API
- [Termo de Uso de IA Generativa](docs/Termo-Uso-IA.md)
