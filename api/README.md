# TelecomOS API

API REST do TelecomOS (Node.js + Express + MySQL). O aplicativo fica na raiz do repositório e o script do banco em `../database/`.

## Executar
1. Copie `.env.example` para `.env` e preencha `DB_PASSWORD` (senha do MySQL) e `JWT_SECRET`.
2. `npm install`
3. `npm run db:setup` (executa `../database/schema.sql`: cria o banco `telecomos`, as tabelas e dados de exemplo)
4. `npm start` (sobe em `http://localhost:3000`; use `npm run dev` para recarregar ao salvar)

## Documentação interativa (Swagger)
Com a API rodando, abra `http://localhost:3000/docs`.
Crie uma conta em `POST /auth/register` (a primeira vira admin), copie o `token`, clique em **Authorize** e cole.

## Perfis
- `viewer`: leitura.
- `technician`: leitura, criação e edição.
- `admin`: tudo, inclusive exclusão.

Para promover um usuário: `UPDATE users SET role = 'admin' WHERE email = '...';`

## Regras de dados
- **CPF** (cadastro de clientes): opcional; se informado, exatamente 11 dígitos (aceita com ou sem pontuação). É salvo apenas com os dígitos.
- Ids expostos: clientes `CLI-<n>` e ordens `OS-<n>`.
