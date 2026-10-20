import { Router } from 'express';
import { pool } from '../db.js';
import { canDelete, canWrite, requireAuth } from '../auth.js';
import { HttpError, oneOf, optionalCpf, parseCode, requiredText } from '../http.js';

export const clientsRouter = Router();
clientsRouter.use(requireAuth);

const STATUSES = ['active', 'pending', 'blocked'];

const toClient = (row) => ({
  id: `CLI-${row.id}`,
  name: row.name,
  cpf: row.cpf ?? undefined,
  plan: row.plan,
  speed: row.speed,
  status: row.status,
  address: row.address,
  onuStatus: row.onu_status,
});

async function findClient(id) {
  const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [parseCode(id, 'CLI')]);
  if (rows.length === 0) throw new HttpError(404, 'Cliente não encontrado.');
  return rows[0];
}

// GET /clients
clientsRouter.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM clients ORDER BY id ASC');
  res.json(rows.map(toClient));
});

// GET /clients/:id
clientsRouter.get('/:id', async (req, res) => {
  res.json(toClient(await findClient(req.params.id)));
});

// POST /clients  { name, plan, address, cpf? }
clientsRouter.post('/', canWrite, async (req, res) => {
  const name = requiredText(req.body?.name, 'Nome', 150);
  const plan = requiredText(req.body?.plan, 'Plano', 120);
  const address = requiredText(req.body?.address, 'Endereço');
  const cpf = optionalCpf(req.body?.cpf);

  const [result] = await pool.query(
    'INSERT INTO clients (name, cpf, plan, address) VALUES (?, ?, ?, ?)',
    [name, cpf, plan, address],
  );
  res.status(201).json(toClient(await findClient(`CLI-${result.insertId}`)));
});

// PATCH /clients/:id  (qualquer subconjunto de: name, cpf, plan, address, status)
clientsRouter.patch('/:id', canWrite, async (req, res) => {
  const current = await findClient(req.params.id);
  const body = req.body ?? {};
  const changes = {};

  if (body.name !== undefined) changes.name = requiredText(body.name, 'Nome', 150);
  if (body.plan !== undefined) changes.plan = requiredText(body.plan, 'Plano', 120);
  if (body.address !== undefined) changes.address = requiredText(body.address, 'Endereço');
  if (body.cpf !== undefined) changes.cpf = optionalCpf(body.cpf);
  if (body.status !== undefined) changes.status = oneOf(body.status, STATUSES, 'Status');

  const columns = Object.keys(changes);
  if (columns.length > 0) {
    const assignments = columns.map((column) => `${column} = ?`).join(', ');
    await pool.query(`UPDATE clients SET ${assignments} WHERE id = ?`, [
      ...columns.map((column) => changes[column]),
      current.id,
    ]);
  }
  res.json(toClient(await findClient(req.params.id)));
});

// DELETE /clients/:id  (somente admin)
clientsRouter.delete('/:id', canDelete, async (req, res) => {
  const current = await findClient(req.params.id);
  await pool.query('DELETE FROM clients WHERE id = ?', [current.id]);
  res.status(204).end();
});
