# Projeto Integrador - Checkpoint 02

## 1. Nome do Projeto
**TelecomOS**

## 2. Objetivo do Checkpoint
Evoluir a organização da navegação da aplicação e realizar a integração inicial com uma Web API REST própria, substituindo os dados fixos (mock) das telas por dados reais armazenados em um banco MySQL.

## 3. Navegação (Expo Router)
A navegação usa roteamento baseado em arquivos (`src/app/`), combinando **Tabs** e **Stack**:

| Rota | Arquivo | Tipo | Descrição |
|---|---|---|---|
| `/login` | `login.tsx` | Stack (pública) | Login e cadastro |
| `/` | `(tabs)/index.tsx` | Tab | Dashboard |
| `/orders` | `(tabs)/orders.tsx` | Tab | Lista de ordens de serviço com filtro por status |
| `/clients` | `(tabs)/clients.tsx` | Tab | Lista de clientes com busca |
| `/settings` | `(tabs)/settings.tsx` | Tab | Perfil do usuário e configurações |
| `/client/[id]` | `client/[id].tsx` | Stack (rota dinâmica) | Detalhe do cliente: editar, alterar status, excluir |
| `/order/[id]` | `order/[id].tsx` | Stack (rota dinâmica) | Detalhe da OS: alterar status, excluir |
| `/new-client` | `new-client.tsx` | Stack | Cadastro de cliente |
| `/new-order` | `new-order.tsx` | Stack | Abertura de ordem de serviço |
| `*` | `+not-found.tsx` | Stack | Rota inexistente |

- As telas de detalhe recebem o identificador por **parâmetro de rota** (`useLocalSearchParams`) e navegam com `router.push({ pathname: '/client/[id]', params: { id } })`.
- As rotas são tipadas (`typedRoutes`), então um caminho inexistente gera erro em tempo de compilação.
- **Rotas protegidas** com `Stack.Protected` no layout raiz: sem login, só a tela `/login` existe; com login, as abas e as demais telas.
- As listas recarregam quando a tela volta a ter foco (`useFocusEffect`), refletindo cadastros, edições e exclusões.

## 4. Web API REST (Node.js + Express + MySQL)
API própria, na pasta `api/` do repositório, com banco **MySQL 8** (`database/schema.sql`). Documentação interativa em **Swagger** (`/docs`). As respostas são JSON, e os erros seguem o formato `{ "message": "..." }`.

| Operação | Verbo | Endpoint | Permissão |
|---|---|---|---|
| Cadastrar usuário | POST | `/auth/register` | pública |
| Login (devolve token JWT) | POST | `/auth/login` | pública |
| Dados do usuário logado | GET | `/auth/me` | logado |
| Listar / buscar clientes | GET | `/clients`, `/clients/:id` | logado |
| Cadastrar cliente | POST | `/clients` | admin, técnico |
| Editar cliente / alterar status | PATCH | `/clients/:id` | admin, técnico |
| Excluir cliente | DELETE | `/clients/:id` | admin |
| Listar / buscar ordens | GET | `/orders`, `/orders/:id` | logado |
| Abrir OS | POST | `/orders` | admin, técnico |
| Alterar status da OS | PATCH | `/orders/:id` | admin, técnico |
| Excluir OS | DELETE | `/orders/:id` | admin |

**Banco de dados** (`database/schema.sql`): tabelas `users`, `clients` e `service_orders`, com campos de situação definidos como `ENUM`.

**Segurança**
- Senhas guardadas com hash **bcrypt**, nunca em texto puro.
- Autenticação por **JWT** (`Authorization: Bearer <token>`), com validade de 7 dias.
- O papel do usuário (admin, técnico ou visualizador) é lido do banco a cada requisição, e a API bloqueia ações sem permissão com erro 403. A interface esconde os botões sem permissão, mas quem de fato bloqueia é a API.
- O primeiro usuário cadastrado vira administrador, e os demais começam como visualizador. O papel nunca é aceito do cliente.
- Todas as consultas usam parâmetros (`?`), o que previne SQL Injection, e os campos são validados antes de gravar.
- **CPF** do cliente: opcional; se informado, exatamente 11 dígitos. No app o campo usa a máscara `000.000.000-00` e a API guarda somente os dígitos.

| Perfil | Leitura | Criar e editar | Excluir |
|---|---|---|---|
| Visualizador (`viewer`) | Sim | Não | Não |
| Técnico (`technician`) | Sim | Sim | Não |
| Administrador (`admin`) | Sim | Sim | Sim |

## 5. Integração do aplicativo com a API
- `src/lib/api.ts`: cliente HTTP com `fetch` (token no cabeçalho, tempo limite de 10 s, tratamento de erro e de falta de conexão).
- `src/services/clients.ts` e `src/services/orders.ts`: uma função por operação da API.
- `src/context/AuthContext.tsx`: login, cadastro, sessão salva no aparelho e papel do usuário.
- `src/hooks/useAsyncList.ts`: carrega listas com estados de carregamento e erro.
- As telas exibem indicador de carregamento, mensagem de erro quando a requisição falha e confirmação antes de excluir.

## 6. Como executar
**API** (pasta `api/`):
1. Copiar `.env.example` para `.env` e preencher a senha do MySQL (`DB_PASSWORD`) e o `JWT_SECRET`.
2. `npm install`
3. `npm run db:setup` (cria o banco `telecomos`, as tabelas e dados de exemplo)
4. `npm start` (a API sobe em `http://localhost:3000`; o Swagger fica em `/docs`)

**Aplicativo** (raiz do projeto):
1. `npm install`
2. `npx expo start` (pressione `w` para abrir na web, ou use um emulador)
3. Na tela de login, criar a primeira conta, que será administradora.

O aplicativo e a API rodam na mesma máquina. Em celular físico, defina `EXPO_PUBLIC_API_URL` com o IP do computador na rede (veja `.env.example`).

## 7. Dificuldades encontradas
- **Acesso do app à API:** o `localhost` do emulador Android aponta para o próprio emulador, então o endereço do computador é `10.0.2.2`. O app escolhe o endereço padrão conforme a plataforma.
- **Identificadores amigáveis:** o banco usa números autoincrementados, mas o app exibe códigos como `CLI-101` e `OS-2041`. A API converte nos dois sentidos.
- **Permissões:** garantir que o bloqueio de ações esteja na API e não só na interface, já que qualquer cliente HTTP poderia chamar os endpoints diretamente.
- **Rotas dinâmicas tipadas:** os tipos das rotas novas só são gerados quando o servidor do Expo é iniciado, o que exigiu cuidado ao remover conversões `as any`.

## 8. Próximos passos
- Dashboard alimentado por dados reais e monitoramento de incidentes.
- Modo offline com sincronização posterior.
- Tela para o administrador gerenciar os perfis dos usuários.

## 9. Hyperlink do Repositório
[https://github.com/LuizVieiraG/TelecomOS](https://github.com/LuizVieiraG/TelecomOS)
