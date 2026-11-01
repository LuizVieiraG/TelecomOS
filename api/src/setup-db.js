// Cria o banco, as tabelas e os dados de exemplo a partir de schema.sql.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';

// No repositório o schema fica em /database; na pasta avulsa da API, ao lado do package.json.
const schemaPath = [
  new URL('../../database/schema.sql', import.meta.url),
  new URL('../schema.sql', import.meta.url),
].find((path) => existsSync(path));
if (!schemaPath) {
  console.error('schema.sql não encontrado (esperado em ../database/ ou na pasta da API).');
  process.exit(1);
}
const dbName = process.env.DB_NAME ?? 'telecomos';
// O banco é escolhido por DB_NAME (em provedores na nuvem ele já existe, ex.: "defaultdb"),
// então as linhas CREATE DATABASE / USE do schema são descartadas.
const sql = (await readFile(schemaPath, 'utf8'))
  .split('\n')
  .filter((line) => !/^\s*(CREATE DATABASE|USE)\b/i.test(line))
  .join('\n');

try {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    multipleStatements: true,
    charset: 'utf8mb4',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  // Localmente cria o banco; na nuvem o usuário pode não ter permissão, e o banco já existe.
  await connection
    .query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    .catch(() => {});
  await connection.query(`USE \`${dbName}\``);
  await connection.query(sql);
  await connection.end();
  console.log('Banco "telecomos" pronto (tabelas e dados de exemplo criados).');
} catch (error) {
  console.error(`Falha ao preparar o banco: ${error.message}`);
  if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('Verifique DB_USER e DB_PASSWORD no arquivo server/.env.');
  }
  process.exit(1);
}
