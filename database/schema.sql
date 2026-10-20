-- TelecomOS: schema MySQL. Executado por `npm run db:setup` (ou cole no MySQL Workbench).

CREATE DATABASE IF NOT EXISTS telecomos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE telecomos;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  role ENUM('admin', 'technician', 'viewer') NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- O id exposto pela API é 'CLI-<num>' (ex.: CLI-101).
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  cpf CHAR(11) NULL, -- somente os 11 dígitos; a máscara é aplicada no app
  plan VARCHAR(120) NOT NULL,
  speed VARCHAR(30) NOT NULL DEFAULT '',
  status ENUM('active', 'pending', 'blocked') NOT NULL DEFAULT 'pending',
  address VARCHAR(255) NOT NULL,
  onu_status ENUM('online', 'offline') NOT NULL DEFAULT 'offline',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) AUTO_INCREMENT = 101;

-- O id exposto pela API é 'OS-<num>' (ex.: OS-2041).
CREATE TABLE IF NOT EXISTS service_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(150) NOT NULL,
  service_type ENUM('Instalação Fibra', 'Reparo de Sinal', 'Troca de Roteador', 'Manutenção Preventiva') NOT NULL,
  address VARCHAR(255) NOT NULL,
  status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  priority ENUM('baixa', 'media', 'alta') NOT NULL DEFAULT 'media',
  scheduled_time VARCHAR(60) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) AUTO_INCREMENT = 2040;

-- Dados de exemplo (INSERT IGNORE: pode rodar de novo sem duplicar)
INSERT IGNORE INTO clients (id, name, plan, speed, status, address, onu_status) VALUES
  (101, 'Carlos Eduardo Santos', 'Fibra 600 Mega Pro', '600 Mbps', 'active', 'Rua Oscar Freire, 1420', 'online'),
  (102, 'Tech Solutions Consultoria', 'Link Dedicado 1 Gbps', '1000 Mbps', 'active', 'Av. Faria Lima, 3477', 'online'),
  (103, 'Juliana Fernandes', 'Fibra 400 Mega Residencial', '400 Mbps', 'pending', 'Rua Pamplona, 630', 'offline'),
  (104, 'Padaria & Confeitaria Central', 'Fibra 500 Mega Comercial', '500 Mbps', 'blocked', 'Rua Haddock Lobo, 915', 'offline');

INSERT IGNORE INTO service_orders (id, client_name, service_type, address, status, priority, scheduled_time) VALUES
  (2040, 'Supermercado Nova Era', 'Manutenção Preventiva', 'Av. Brigadeiro Luis Antonio, 2100', 'completed', 'baixa', 'Ontem, 16:20'),
  (2041, 'Roberto Carvalho', 'Instalação Fibra', 'Av. Paulista, 1240 - Apto 82', 'pending', 'alta', 'Hoje, 14:00'),
  (2042, 'Clinica Médica Central', 'Reparo de Sinal', 'Rua Augusta, 510 - Sala 3', 'in_progress', 'alta', 'Hoje, 15:30'),
  (2043, 'Mariana Lima', 'Troca de Roteador', 'Rua Bela Cintra, 890', 'pending', 'media', 'Hoje, 17:00');
