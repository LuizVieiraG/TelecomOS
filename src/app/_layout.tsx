import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isDark, theme } = useTheme();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) SplashScreen.hide();
  }, [loading]);

  // Mantém a splash visível até a sessão salva ser restaurada.
  if (loading) return null;

  const signedIn = profile !== null;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        {/* Rotas protegidas: só existem com usuário logado */}
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="new-client" options={{ title: 'Novo Cliente' }} />
          <Stack.Screen name="new-order" options={{ title: 'Nova Ordem de Serviço' }} />
          <Stack.Screen name="client/[id]" options={{ title: 'Cliente' }} />
          <Stack.Screen name="order/[id]" options={{ title: 'Ordem de Serviço' }} />
        </Stack.Protected>

        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen name="+not-found" options={{ title: 'Não Encontrado' }} />
      </Stack>
    </>
  );
}
