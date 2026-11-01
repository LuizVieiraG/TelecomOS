import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../auth.js';

export const statsRouter = Router();
statsRouter.use(requireAuth);

// GET /stats  -> contagens para o dashboard (calculadas no banco, em vez de baixar as listas inteiras)
statsRouter.get('/', async (_req, res) => {
  // SUM(condição) soma 1 para cada linha verdadeira; COALESCE evita null quando a tabela está vazia.
  const [[clients]] = await pool.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(status = 'active'), 0) AS active,
            COALESCE(SUM(status = 'pending'), 0) AS pending,
            COALESCE(SUM(status = 'blocked'), 0) AS blocked,
            COALESCE(SUM(onu_status = 'online'), 0) AS online
       FROM clients`,
  );
  const [[orders]] = await pool.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(status = 'pending'), 0) AS pending,
            COALESCE(SUM(status = 'in_progress'), 0) AS inProgress,
            COALESCE(SUM(status = 'completed'), 0) AS completed,
            COALESCE(SUM(priority = 'alta' AND status <> 'completed'), 0) AS urgent
       FROM service_orders`,
  );

  // O MySQL devolve SUM como texto/decimal; converte tudo para número.
  const toNumbers = (row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, Number(value)]));
  res.json({ clients: toNumbers(clients), orders: toNumbers(orders) });
});
