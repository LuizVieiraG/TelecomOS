# Projeto Integrador - Checkpoint 01

## 1. Nome do Projeto
**TelecomOS**

## 2. Objetivo da Aplicação
O TelecomOS é um sistema mobile voltado para provedores de internet (ISPs) e empresas de telecomunicações. Seu objetivo principal é fornecer uma plataforma centralizada e de alta performance para monitoramento de rede, gerenciamento de ordens de serviço (OS) em campo e administração da base de assinantes, permitindo respostas rápidas a incidentes e otimização do fluxo de trabalho técnico.

## 3. Funcionalidades previstas para o projeto completo
- **Dashboard em Tempo Real:** Visualização de métricas da rede (disponibilidade, nós ativos, latência, tráfego).
- **Gestão de Ordens de Serviço (OS):** Criação, acompanhamento e fechamento de chamados técnicos com geolocalização.
- **Gestão de Clientes/Assinantes:** Consulta de dados de contrato, status de conexão e histórico de chamados.
- **Monitoramento de Incidentes:** Alertas automatizados para quedas de backbone ou falhas de energia nos nós.
- **Modo Offline:** Capacidade de técnicos atualizarem o status de uma OS mesmo em áreas sem cobertura de rede (sincronização posterior).
- **Sistema de Temas:** Suporte nativo e adaptável a temas Light e Dark.

## 4. Funcionalidades implementadas até o Checkpoint 01
- **Arquitetura Base:** Projeto inicializado utilizando React Native (via Expo) e TypeScript, estruturado de forma modular (`src/app`, `src/components`, `src/constants`).
- **Navegação com Expo Router:** Implementação do sistema de roteamento baseado em arquivos (file-based routing), incluindo uma navegação principal inferior (`Tabs`).
- **Sistema de Estilos e Tema Customizado:** Criação de uma paleta de cores consistente (Azul, Preto, Branco) que responde dinamicamente às configurações do sistema operacional (Light/Dark mode) através do hook `useColorScheme`.
- **Telas Iniciais:** Desenvolvimento da interface base das abas: Dashboard, Ordens, Clientes e Configurações, utilizando Flexbox para um layout responsivo.
- **Componentização:** Criação de componentes reutilizáveis, como o `MetricCard` que recebe propriedades (`props`) para renderizar diferentes métricas no Dashboard.
- **Gestão de Estado:** Utilização inicial do Hook `useState` para criar interatividade na tela principal (funcionalidade de ocultar/mostrar o painel de métricas de rede).

## 5. Dificuldades encontradas durante o desenvolvimento
- **Migração para Expo Router:** A transição do modelo clássico de navegação (`App.tsx` e `React Navigation` puro) para o modelo de rotas baseadas em arquivos (`src/app`) exigiu refatoração da estrutura inicial e compreensão de novos padrões (ex: `_layout.tsx`).
- **Gerenciamento de Dependências:** Houve conflitos de peer dependencies relacionados ao pacote de ícones (`@expo/vector-icons` e `expo-font`) devido a inconsistências no ambiente local (Node.js/NPM), solucionados utilizando o comando `npx expo install` que garante as versões compatíveis com o SDK do Expo atual.

## 6. Hyperlink do Repositório
[https://github.com/LuizVieiraG/TelecomOS](https://github.com/LuizVieiraG/TelecomOS)
