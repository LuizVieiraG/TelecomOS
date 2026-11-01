# Projeto Integrador - Checkpoint 03 (Entrega Final)

## 1. Nome do Projeto
**TelecomOS**

## 2. Objetivo do Checkpoint
Entregar o aplicativo mobile funcional em React Native (Expo), com integração completa a uma Web API REST própria, publicada em servidor na nuvem. Nesta etapa o dashboard deixa de usar dados fixos e passa a exibir números reais calculados no banco de dados.

## 3. Resumo do projeto
Sistema para provedores de internet com gestão de **clientes** e **ordens de serviço (OS)**, autenticação com perfis de acesso e um painel com indicadores operacionais.

## 4. Conceitos do semestre aplicados
| Conceito | Onde aparece |
|---|---|
| Componentes e props | `MetricCard`, `ChoiceChips`, `FormField`, `ClientForm` |
| Estado (`useState`) | Formulários, filtros, alternância das métricas no dashboard |
| Efeitos e ciclo de vida (`useEffect`, `useFocusEffect`) | Recarga das listas e do dashboard ao voltar para a tela |
| Hooks personalizados | `useAsyncList`, `useTheme` |
| Context API | `AuthContext` (sessão, login, papel do usuário) |
| Navegação (Expo Router: Tabs + Stack + rotas dinâmicas) | `src/app/` |
| Rotas protegidas | `Stack.Protected` no layout raiz |
| Listas (`FlatList`), `RefreshControl`, `ActivityIndicator` | Telas de clientes, ordens e dashboard |
| Formulários com validação e máscara | Cadastro de cliente (CPF), abertura de OS |
| Tema claro e escuro | `src/constants/theme.ts` |
| Consumo de Web API (`fetch`, JWT, tratamento de erros) | `src/lib/api.ts` e `src/services/` |
| TypeScript | Tipos em `src/types`, rotas tipadas |

## 5. Funcionalidades
- Cadastro e login de usuários, com sessão mantida no aparelho.
- **Dashboard** com indicadores reais: clientes ativos, bloqueados e pendentes, ONUs online, OS pendentes, em andamento, concluídas e urgentes. Atualiza ao abrir a aba e com "puxar para atualizar".
- **Clientes:** listar, buscar, cadastrar, editar, alterar status e excluir.
- **Ordens de serviço:** listar, filtrar por status, abrir, alterar status e excluir.
- **Configurações:** perfil do usuário e tema.
- Controle de acesso por perfil (visualizador, técnico e administrador), aplicado na API e refletido na interface.
- Indicador de carregamento, mensagem de erro e confirmação antes de excluir.

## 6. Navegação
| Rota | Tipo | Descrição |
|---|---|---|
| `/login` | Stack (pública) | Login e cadastro |
| `/` | Tab | Dashboard |
| `/orders` | Tab | Ordens de serviço |
| `/clients` | Tab | Clientes |
| `/settings` | Tab | Perfil e configurações |
| `/client/[id]` | Stack | Detalhe do cliente |
| `/order/[id]` | Stack | Detalhe da OS |
| `/new-client` | Stack | Cadastro de cliente |
| `/new-order` | Stack | Abertura de OS |
| `*` | Stack | Rota inexistente |

## 7. Web API REST
API em **Node.js + Express + MySQL**, na pasta `api/`, com documentação **Swagger** em `/docs`.

| Operação | Verbo | Endpoint | Permissão |
|---|---|---|---|
| Cadastrar usuário | POST | `/auth/register` | pública |
| Login (token JWT) | POST | `/auth/login` | pública |
| Usuário logado | GET | `/auth/me` | logado |
| **Indicadores do dashboard** | GET | `/stats` | logado |
| Listar / buscar clientes | GET | `/clients`, `/clients/:id` | logado |
| Cadastrar / editar cliente | POST / PATCH | `/clients`, `/clients/:id` | admin, técnico |
| Excluir cliente | DELETE | `/clients/:id` | admin |
| Listar / buscar ordens | GET | `/orders`, `/orders/:id` | logado |
| Abrir / alterar OS | POST / PATCH | `/orders`, `/orders/:id` | admin, técnico |
| Excluir OS | DELETE | `/orders/:id` | admin |
| Verificação de saúde | GET | `/health` | pública |

**Novidade desta entrega: `GET /stats`.** Em vez de o app baixar as listas completas e contar no celular, a API calcula os totais com `COUNT` e `SUM` no próprio banco e devolve um JSON pequeno, no formato `{ clients: {...}, orders: {...} }`. Isso reduz tráfego e mantém a regra de negócio no servidor.

**Segurança:** senhas com hash bcrypt, JWT com validade de 7 dias, papel do usuário lido do banco a cada requisição, consultas parametrizadas (contra SQL Injection) e validação dos campos antes de gravar.

## 8. Publicação (deploy)
- **API:** Render (Web Service), configurada pelo arquivo `render.yaml`. O `JWT_SECRET` é gerado automaticamente e as variáveis `DB_*` são informadas no painel. A rota `/health` é usada como verificação de saúde.
- **Banco de dados:** MySQL em nuvem, com conexão por SSL (`DB_SSL=true`). As tabelas e os dados de exemplo são criados com `npm run db:setup`.
- **Aplicativo:** o endereço da API é definido por `EXPO_PUBLIC_API_URL`.

**URL da API publicada:** `PREENCHER_COM_A_URL_DO_RENDER`
**Swagger:** `PREENCHER_COM_A_URL_DO_RENDER/docs`

> O plano gratuito do Render hiberna a API após alguns minutos sem uso, então a primeira requisição pode levar cerca de um minuto.

## 9. Como executar
**Opção A: usando a API publicada**
1. Na raiz do projeto, criar `.env.local` com `EXPO_PUBLIC_API_URL=<URL da API publicada>`.
2. `npm install`
3. `npx expo start`
4. Na tela de login, criar a primeira conta (vira administradora).

**Opção B: tudo local**
1. Na pasta `api/`: copiar `.env.example` para `.env`, preencher `DB_PASSWORD` e `JWT_SECRET`, depois `npm install`, `npm run db:setup` e `npm start`.
2. Na raiz: `npm install` e `npx expo start`.

## 10. Dificuldades encontradas
- **Variáveis de ambiente no Render:** o `startCommand` local usa `--env-file`, mas no Render não existe arquivo `.env`; as variáveis vêm do painel.
- **MySQL em nuvem:** o plano gratuito do Render não hospeda MySQL, então o banco fica em outro provedor e exige conexão por SSL.
- **Tipos numéricos do MySQL:** `SUM` volta como texto/decimal; a API converte os totais para número antes de responder.
- **Contagem no servidor:** mover as contagens do dashboard para a API evitou baixar listas inteiras só para contar.

## 11. Limitações e trabalhos futuros
- Modo offline com sincronização posterior.
- Tela para o administrador gerenciar os perfis dos usuários.
- Monitoramento de incidentes de rede e testes automatizados.

## 12. Hyperlink do Repositório
[https://github.com/LuizVieiraG/TelecomOS](https://github.com/LuizVieiraG/TelecomOS)
