import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'telecomos',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  // MySQL na nuvem (Aiven, TiDB, ...) exige conexão TLS: defina DB_SSL=true.
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});
