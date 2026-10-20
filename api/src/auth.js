import jwt from 'jsonwebtoken';
import { pool } from './db.js';
import { HttpError } from './http.js';

const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error('JWT_SECRET não definido. Copie server/.env.example para server/.env e preencha.');
  process.exit(1);
}

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: '7d' });

// Exige "Authorization: Bearer <token>" e disponibiliza req.user = { id, role }.
// O papel é lido do banco a cada requisição, então promoções valem na hora.
export async function requireAuth(req, _res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new HttpError(401, 'Faça login para continuar.');

  let userId;
  try {
    userId = jwt.verify(token, secret).sub;
  } catch {
    throw new HttpError(401, 'Sessão expirada. Faça login novamente.');
  }

  const [rows] = await pool.query('SELECT id, role FROM users WHERE id = ?', [userId]);
  if (rows.length === 0) throw new HttpError(401, 'Usuário não encontrado.');
  req.user = { id: rows[0].id, role: rows[0].role };
  next();
}

// Permite o acesso apenas aos papéis informados.
export const requireRole =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new HttpError(403, 'Seu perfil não tem permissão para esta ação.');
    }
    next();
  };

export const canWrite = requireRole('admin', 'technician');
export const canDelete = requireRole('admin');
