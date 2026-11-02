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
| Renderização de listas (`ScrollView` + `.map`), `RefreshControl`, `ActivityIndicator` | Telas de clientes, ordens e dashboard |
| Renderização condicional | Carregando, erro, lista vazia (`EmptyState`) e botões por perfil |
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
- Mensagens para **lista vazia** (nenhum cliente/OS cadastrado) e para **busca ou filtro sem resultado**, com o componente reutilizável `EmptyState`.

### Tratamento de erros
| Situação | Como o app trata |
|---|---|
| Falha de conexão / API indisponível | Mensagem "Sem conexão com a API" (tempo limite de 10 s, `AbortController`) |
| Sessão expirada (HTTP 401) | Encerra a sessão e volta ao login |
| Sem permissão (HTTP 403) | Mostra a mensagem retornada pela API |
| Dado não encontrado (HTTP 404) | Mostra a mensagem retornada pela API |
| Erro de validação (HTTP 400) | Mostra a mensagem da API e valida CPF e campos obrigatórios no formulário |
| Carregando informações | `ActivityIndicator` e "puxar para atualizar" no dashboard |

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
- **Banco de dados:** MySQL 8 hospedado no **Aiven**, com conexão por SSL (`DB_SSL=true`). As tabelas e os dados de exemplo são criados com `npm run db:setup` (script em `database/schema.sql`).
- **Aplicativo:** usa a API publicada por padrão (`src/lib/api.ts`). A variável `EXPO_PUBLIC_API_URL` é opcional e serve para apontar para outra API, como uma local.

**URL da API publicada:** `https://telecomos-api.onrender.com`
**Swagger:** `https://telecomos-api.onrender.com/docs`

> O plano gratuito do Render hiberna a API após alguns minutos sem uso, então a primeira requisição pode levar cerca de um minuto.

## 9. Como executar
Requisitos: Node.js 20.6 ou superior. Para a Opção B, também MySQL 8.

**Opção A: usando a API e o banco publicados (recomendada)**
A API (Render) e o banco (Aiven) já estão no ar, então só o aplicativo roda na máquina:
1. `git clone -b checkpoint-3 https://github.com/LuizVieiraG/TelecomOS.git`
2. Na raiz do projeto: `npm install`
3. `npx expo start` e abrir no navegador (`w`), no emulador Android (`a`) ou no Expo Go (QR code).
4. Na tela de login, entrar ou criar uma conta (a primeira conta de um banco vazio vira administradora).

Não é preciso criar `.env`. Na primeira requisição, a API pode levar até 1 minuto para acordar (plano gratuito do Render).

**Opção B: tudo local (aplicativo, WebAPI e banco)**
1. **Banco de dados:** com o MySQL 8 rodando, o `database/schema.sql` é aplicado pelo passo 2 (ou manualmente com `mysql -u root -p < database/schema.sql`).
2. **WebAPI**, na pasta `api/`: copiar `.env.example` para `.env`, preencher `DB_PASSWORD` e `JWT_SECRET`, depois `npm install`, `npm run db:setup` (cria o banco `telecomos`, as tabelas e dados de exemplo) e `npm start` (sobe em `http://localhost:3000`, Swagger em `/docs`).
3. **Aplicativo**, na raiz: criar `.env.local` com `EXPO_PUBLIC_API_URL=http://localhost:3000` (emulador Android: `http://10.0.2.2:3000`; celular físico: o IP do computador na rede), depois `npm install` e `npx expo start`.

## 10. Dificuldades encontradas
- **Variáveis de ambiente no Render:** o `startCommand` local usa `--env-file`, mas no Render não existe arquivo `.env`; as variáveis vêm do painel.
- **MySQL em nuvem:** o plano gratuito do Render não hospeda MySQL, então o banco fica em outro provedor e exige conexão por SSL.
- **Tipos numéricos do MySQL:** `SUM` volta como texto/decimal; a API converte os totais para número antes de responder.
- **Contagem no servidor:** mover as contagens do dashboard para a API evitou baixar listas inteiras só para contar.

## 11. Limitações e trabalhos futuros
- Modo offline com sincronização posterior.
- Tela para o administrador gerenciar os perfis dos usuários.
- Monitoramento de incidentes de rede e testes automatizados.

## 12. Termo de Uso de Inteligência Artificial Generativa
Ver [Termo-Uso-IA.md](Termo-Uso-IA.md).

## 13. Hyperlink do Repositório
[https://github.com/LuizVieiraG/TelecomOS](https://github.com/LuizVieiraG/TelecomOS)
