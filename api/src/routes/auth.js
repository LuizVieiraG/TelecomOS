import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { requireAuth, signToken } from '../auth.js';
import { HttpError, requiredText } from '../http.js';

export const authRouter = Router();

const toUser = (row) => ({ id: String(row.id), name: row.name, email: row.email, role: row.role });

// POST /auth/register  { name, email, password }
// O primeiro usuário vira admin; os demais começam como viewer (o papel nunca vem do cliente).
authRouter.post('/register', async (req, res) => {
  const name = requiredText(req.body?.name, 'Nome', 120);
  const email = requiredText(req.body?.email, 'E-mail', 190).toLowerCase();
  const password = requiredText(req.body?.password, 'Senha', 72);
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'E-mail inválido.');
  if (password.length < 6) throw new HttpError(400, 'A senha deve ter pelo menos 6 caracteres.');

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) throw new HttpError(409, 'Este e-mail já está cadastrado.');

  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM users');
  const role = total === 0 ? 'admin' : 'viewer';
  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role],
  );
  const user = toUser({ id: result.insertId, name, email, role });
  res.status(201).json({ token: signToken(user), user });
});

// POST /auth/login  { email, password }
authRouter.post('/login', async (req, res) => {
  const email = requiredText(req.body?.email, 'E-mail', 190).toLowerCase();
  const password = requiredText(req.body?.password, 'Senha', 72);

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const valid = rows.length > 0 && (await bcrypt.compare(password, rows[0].password_hash));
  if (!valid) throw new HttpError(401, 'E-mail ou senha incorretos.');

  const user = toUser(rows[0]);
  res.json({ token: signToken(user), user });
});

// GET /auth/me  -> dados e papel do usuário logado (lidos do banco, então refletem promoções)
authRouter.get('/me', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
  if (rows.length === 0) throw new HttpError(401, 'Usuário não encontrado.');
  res.json(toUser(rows[0]));
});
