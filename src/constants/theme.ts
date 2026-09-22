export const colors = {
  // Paleta Principal: Azul, Preto e Branco
  primary: '#0066FF',       // Azul Telecom vibrante e profissional
  primaryDark: '#0047B3',   // Azul escuro
  primaryLight: '#EBF3FF',  // Azul muito suave para backgrounds de destaque
  black: '#0A0E17',         // Preto profundo
  white: '#FFFFFF',         // Branco puro

  // Cores de status operacionais
  success: '#10B981',       // Verde status online/sucesso
  warning: '#F59E0B',       // Amarelo atenção
  danger: '#EF4444',        // Vermelho alerta
  gray: '#64748B',          // Cinza neutro para textos secundários e ícones inativos

  // Tema Claro (Predominância Branco com detalhes em Preto e Azul)
  light: {
    background: '#F6F8FB',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    text: '#0A0E17',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    card: '#FFFFFF',
    tint: '#0066FF',
  },

  // Tema Escuro (Predominância Preto com detalhes em Branco e Azul)
  dark: {
    background: '#070A0F',
    surface: '#0F1523',
    surfaceSecondary: '#172033',
    text: '#FFFFFF',
    textSecondary: '#94A3B8',
    border: '#1E293B',
    tabBar: '#0A0E17',
    tabBarBorder: '#1E293B',
    card: '#0F1523',
    tint: '#0066FF',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  full: 9999,
};
