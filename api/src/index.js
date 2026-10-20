import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { openapi } from './openapi.js';
import { authRouter } from './routes/auth.js';
import { clientsRouter } from './routes/clients.js';
import { ordersRouter } from './routes/orders.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Documentação interativa (Swagger UI) e especificação em JSON.
app.get('/docs/openapi.json', (_req, res) => res.json(openapi));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'TelecomOS API' }));
app.get('/', (_req, res) => res.redirect('/docs'));
app.use('/auth', authRouter);
app.use('/clients', clientsRouter);
app.use('/orders', ordersRouter);

app.use((_req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));

// Formato único de erro: { message }. O app lê esse campo.
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ message: 'JSON inválido.' });
  }
  if (error.status) return res.status(error.status).json({ message: error.message });
  console.error(error);
  if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_BAD_DB_ERROR') {
    return res.status(503).json({ message: 'Banco de dados indisponível. Verifique o MySQL e o server/.env.' });
  }
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API TelecomOS em http://localhost:${port}`);
});
