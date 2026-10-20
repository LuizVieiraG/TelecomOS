# Banco de dados

Banco **MySQL 8** do TelecomOS. O arquivo [`schema.sql`](schema.sql) cria o banco `telecomos`, as tabelas e dados de exemplo.

| Tabela | Descrição |
|---|---|
| `users` | Usuários do sistema (senha com hash bcrypt) e papel: `admin`, `technician` ou `viewer` |
| `clients` | Assinantes (CPF opcional, somente os 11 dígitos) |
| `service_orders` | Ordens de serviço |

## Como aplicar
O jeito mais simples é pela API: `cd api && npm run db:setup`.

Também é possível executar o `schema.sql` diretamente no MySQL Workbench ou com `mysql -u root -p < database/schema.sql`.

O script é idempotente (`IF NOT EXISTS` / `INSERT IGNORE`) e **não contém usuários nem senhas**: as contas são criadas pelo aplicativo.
