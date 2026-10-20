// Especificação OpenAPI 3 da API (exibida em /docs com Swagger UI; JSON em /docs/openapi.json).

const bearer = [{ bearerAuth: [] }];

const error = (description) => ({
  description,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
});

const json = (schema) => ({ 'application/json': { schema } });
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });

const clientId = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Código do cliente',
  schema: { type: 'string', example: 'CLI-101' },
};
const orderId = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Código da ordem de serviço',
  schema: { type: 'string', example: 'OS-2041' },
};

const authResponses = {
  401: error('Token ausente, inválido ou expirado'),
};
const writeResponses = {
  ...authResponses,
  403: error('Perfil sem permissão (exige admin ou technician)'),
};

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'TelecomOS API',
    version: '1.0.0',
    description:
      'API REST do TelecomOS (Node + Express + MySQL).\n\n' +
      '**Como testar:** crie uma conta em `POST /auth/register` (a primeira vira admin) ou entre em `POST /auth/login`, ' +
      'copie o `token` da resposta, clique em **Authorize** e cole o token.\n\n' +
      '**Perfis:** `viewer` lê; `technician` lê, cria e edita; `admin` também exclui.',
  },
  servers: [{ url: '/', description: 'Servidor atual' }],
  tags: [
    { name: 'Saúde' },
    { name: 'Autenticação' },
    { name: 'Clientes' },
    { name: 'Ordens de serviço' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Cliente não encontrado.' } },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Luiz Vieira' },
          email: { type: 'string', example: 'luiz@empresa.com' },
          role: { type: 'string', enum: ['admin', 'technician', 'viewer'] },
        },
      },
      AuthResult: {
        type: 'object',
        properties: { token: { type: 'string' }, user: ref('User') },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Luiz Vieira' },
          email: { type: 'string', example: 'luiz@empresa.com' },
          password: { type: 'string', minLength: 6, example: '123456' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'luiz@empresa.com' },
          password: { type: 'string', example: '123456' },
        },
      },
      Client: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'CLI-101' },
          name: { type: 'string', example: 'Carlos Eduardo Santos' },
          cpf: { type: 'string', example: '12345678909', description: 'Somente os 11 dígitos' },
          plan: { type: 'string', example: 'Fibra 600 Mega Pro' },
          speed: { type: 'string', example: '600 Mbps' },
          status: { type: 'string', enum: ['active', 'pending', 'blocked'] },
          address: { type: 'string', example: 'Rua Oscar Freire, 1420' },
          onuStatus: { type: 'string', enum: ['online', 'offline'] },
        },
      },
      NewClient: {
        type: 'object',
        required: ['name', 'plan', 'address'],
        properties: {
          name: { type: 'string', example: 'Maria Souza' },
          cpf: { type: 'string', example: '987.654.321-00', description: 'Opcional. Aceita com ou sem pontuação; deve ter 11 dígitos. É salvo apenas com os dígitos.' },
          plan: { type: 'string', example: 'Fibra 300 Mega' },
          address: { type: 'string', example: 'Rua das Flores, 100' },
        },
      },
      ClientPatch: {
        type: 'object',
        description: 'Qualquer subconjunto dos campos',
        properties: {
          name: { type: 'string', example: 'Maria Souza Lima' },
          cpf: { type: 'string', example: '', description: 'Vazio remove o CPF; caso contrário, 11 dígitos' },
          plan: { type: 'string', example: 'Fibra 500 Mega' },
          address: { type: 'string', example: 'Rua das Flores, 200' },
          status: { type: 'string', enum: ['active', 'pending', 'blocked'], example: 'active' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'OS-2041' },
          clientName: { type: 'string', example: 'Roberto Carvalho' },
          serviceType: {
            type: 'string',
            enum: ['Instalação Fibra', 'Reparo de Sinal', 'Troca de Roteador', 'Manutenção Preventiva'],
          },
          address: { type: 'string', example: 'Av. Paulista, 1240' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
          priority: { type: 'string', enum: ['baixa', 'media', 'alta'] },
          scheduledTime: { type: 'string', example: 'Hoje, 14:00' },
        },
      },
      NewOrder: {
        type: 'object',
        required: ['clientName', 'serviceType', 'address', 'scheduledTime'],
        properties: {
          clientName: { type: 'string', example: 'Roberto Carvalho' },
          serviceType: {
            type: 'string',
            enum: ['Instalação Fibra', 'Reparo de Sinal', 'Troca de Roteador', 'Manutenção Preventiva'],
            example: 'Instalação Fibra',
          },
          address: { type: 'string', example: 'Av. Paulista, 1240' },
          priority: { type: 'string', enum: ['baixa', 'media', 'alta'], example: 'alta' },
          scheduledTime: { type: 'string', example: 'Hoje, 14:00' },
        },
      },
      OrderStatusPatch: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], example: 'in_progress' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Saúde'],
        summary: 'Verifica se a API está no ar',
        responses: {
          200: {
            description: 'API no ar',
            content: json({ type: 'object', properties: { status: { type: 'string', example: 'ok' } } }),
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Cadastra um usuário (o primeiro vira admin; os demais, viewer)',
        requestBody: { required: true, content: json(ref('RegisterInput')) },
        responses: {
          201: { description: 'Usuário criado', content: json(ref('AuthResult')) },
          400: error('Dados inválidos'),
          409: error('E-mail já cadastrado'),
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Faz login e devolve o token JWT',
        requestBody: { required: true, content: json(ref('LoginInput')) },
        responses: {
          200: { description: 'Login realizado', content: json(ref('AuthResult')) },
          400: error('Dados inválidos'),
          401: error('E-mail ou senha incorretos'),
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Autenticação'],
        summary: 'Dados e perfil do usuário logado',
        security: bearer,
        responses: {
          200: { description: 'Usuário logado', content: json(ref('User')) },
          ...authResponses,
        },
      },
    },
    '/clients': {
      get: {
        tags: ['Clientes'],
        summary: 'Lista os clientes',
        security: bearer,
        responses: {
          200: { description: 'Lista de clientes', content: json({ type: 'array', items: ref('Client') }) },
          ...authResponses,
        },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Cadastra um cliente (admin, technician)',
        security: bearer,
        requestBody: { required: true, content: json(ref('NewClient')) },
        responses: {
          201: { description: 'Cliente criado', content: json(ref('Client')) },
          400: error('Dados inválidos'),
          ...writeResponses,
        },
      },
    },
    '/clients/{id}': {
      parameters: [clientId],
      get: {
        tags: ['Clientes'],
        summary: 'Busca um cliente',
        security: bearer,
        responses: {
          200: { description: 'Cliente', content: json(ref('Client')) },
          404: error('Cliente não encontrado'),
          ...authResponses,
        },
      },
      patch: {
        tags: ['Clientes'],
        summary: 'Edita dados ou status do cliente (admin, technician)',
        security: bearer,
        requestBody: { required: true, content: json(ref('ClientPatch')) },
        responses: {
          200: { description: 'Cliente atualizado', content: json(ref('Client')) },
          400: error('Dados inválidos'),
          404: error('Cliente não encontrado'),
          ...writeResponses,
        },
      },
      delete: {
        tags: ['Clientes'],
        summary: 'Exclui um cliente (somente admin)',
        security: bearer,
        responses: {
          204: { description: 'Excluído' },
          404: error('Cliente não encontrado'),
          ...authResponses,
          403: error('Somente admin'),
        },
      },
    },
    '/orders': {
      get: {
        tags: ['Ordens de serviço'],
        summary: 'Lista as ordens de serviço',
        security: bearer,
        responses: {
          200: { description: 'Lista de ordens', content: json({ type: 'array', items: ref('Order') }) },
          ...authResponses,
        },
      },
      post: {
        tags: ['Ordens de serviço'],
        summary: 'Abre uma ordem de serviço (admin, technician)',
        security: bearer,
        requestBody: { required: true, content: json(ref('NewOrder')) },
        responses: {
          201: { description: 'Ordem criada', content: json(ref('Order')) },
          400: error('Dados inválidos'),
          ...writeResponses,
        },
      },
    },
    '/orders/{id}': {
      parameters: [orderId],
      get: {
        tags: ['Ordens de serviço'],
        summary: 'Busca uma ordem de serviço',
        security: bearer,
        responses: {
          200: { description: 'Ordem', content: json(ref('Order')) },
          404: error('Ordem não encontrada'),
          ...authResponses,
        },
      },
      patch: {
        tags: ['Ordens de serviço'],
        summary: 'Altera o status da ordem (admin, technician)',
        security: bearer,
        requestBody: { required: true, content: json(ref('OrderStatusPatch')) },
        responses: {
          200: { description: 'Ordem atualizada', content: json(ref('Order')) },
          400: error('Status inválido'),
          404: error('Ordem não encontrada'),
          ...writeResponses,
        },
      },
      delete: {
        tags: ['Ordens de serviço'],
        summary: 'Exclui uma ordem de serviço (somente admin)',
        security: bearer,
        responses: {
          204: { description: 'Excluída' },
          404: error('Ordem não encontrada'),
          ...authResponses,
          403: error('Somente admin'),
        },
      },
    },
  },
};
