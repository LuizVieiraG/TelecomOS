import { Router } from 'express';
import { pool } from '../db.js';
import { canDelete, canWrite, requireAuth } from '../auth.js';
import { HttpError, oneOf, parseCode, requiredText } from '../http.js';

export const ordersRouter = Router();
ordersRouter.use(requireAuth);

const SERVICE_TYPES = ['Instalação Fibra', 'Reparo de Sinal', 'Troca de Roteador', 'Manutenção Preventiva'];
const STATUSES = ['pending', 'in_progress', 'completed'];
const PRIORITIES = ['baixa', 'media', 'alta'];

const toOrder = (row) => ({
  id: `OS-${row.id}`,
  clientName: row.client_name,
  serviceType: row.service_type,
  address: row.address,
  status: row.status,
  priority: row.priority,
  scheduledTime: row.scheduled_time,
});

async function findOrder(id) {
  const [rows] = await pool.query('SELECT * FROM service_orders WHERE id = ?', [parseCode(id, 'OS')]);
  if (rows.length === 0) throw new HttpError(404, 'Ordem de serviço não encontrada.');
  return rows[0];
}

// GET /orders
ordersRouter.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM service_orders ORDER BY id ASC');
  res.json(rows.map(toOrder));
});

// GET /orders/:id
ordersRouter.get('/:id', async (req, res) => {
  res.json(toOrder(await findOrder(req.params.id)));
});

// POST /orders  { clientName, serviceType, address, priority, scheduledTime }
ordersRouter.post('/', canWrite, async (req, res) => {
  const body = req.body ?? {};
  const clientName = requiredText(body.clientName, 'Cliente', 150);
  const address = requiredText(body.address, 'Endereço');
  const scheduledTime = requiredText(body.scheduledTime, 'Horário', 60);
  const serviceType = oneOf(body.serviceType, SERVICE_TYPES, 'Tipo de serviço');
  const priority = oneOf(body.priority ?? 'media', PRIORITIES, 'Prioridade');

  const [result] = await pool.query(
    `INSERT INTO service_orders (client_name, service_type, address, priority, scheduled_time)
     VALUES (?, ?, ?, ?, ?)`,
    [clientName, serviceType, address, priority, scheduledTime],
  );
  res.status(201).json(toOrder(await findOrder(`OS-${result.insertId}`)));
});

// PATCH /orders/:id  { status }
ordersRouter.patch('/:id', canWrite, async (req, res) => {
  const current = await findOrder(req.params.id);
  const status = oneOf(req.body?.status, STATUSES, 'Status');
  await pool.query('UPDATE service_orders SET status = ? WHERE id = ?', [status, current.id]);
  res.json(toOrder(await findOrder(req.params.id)));
});

// DELETE /orders/:id  (somente admin)
ordersRouter.delete('/:id', canDelete, async (req, res) => {
  const current = await findOrder(req.params.id);
  await pool.query('DELETE FROM service_orders WHERE id = ?', [current.id]);
  res.status(204).end();
});
