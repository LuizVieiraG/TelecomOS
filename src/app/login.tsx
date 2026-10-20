import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import FormField from '@/components/FormField';

// Ao entrar, o guard em _layout.tsx redireciona automaticamente para as abas.
export default function LoginScreen() {
  const { theme } = useTheme();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async () => {
    if (!email.trim() || !password || (isRegister && !name.trim())) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    setBusy(true);
    try {
      if (isRegister) {
        await signUp(name, email, password);
      } else {
        await signIn(email, password);
      }
    } catch (e) {
      Alert.alert(isRegister ? 'Erro no cadastro' : 'Erro no login', e instanceof Error ? e.message : 'Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="git-network-outline" size={32} color={colors.white} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>TelecomOS</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isRegister ? 'Crie sua conta' : 'Acesse sua conta'}
          </Text>
        </View>

        {isRegister ? (
          <FormField label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
        ) : null}
        <FormField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@empresa.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <FormField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          autoCapitalize="none"
          textContentType={isRegister ? 'newPassword' : 'password'}
          onSubmitEditing={handleSubmit}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, opacity: busy ? 0.6 : 1 }]}
          onPress={handleSubmit}
          disabled={busy}
          accessibilityRole="button"
        >
          {busy ? <ActivityIndicator color={colors.white} /> : null}
          <Text style={styles.buttonText}>{isRegister ? 'Criar conta' : 'Entrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode(isRegister ? 'login' : 'register')}
          style={styles.switch}
          accessibilityRole="button"
        >
          <Text style={{ color: colors.primary, fontWeight: '600' }}>
            {isRegister ? 'Já tenho conta' : 'Criar uma conta'}
          </Text>
        </TouchableOpacity>

        {isRegister ? (
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            A primeira conta criada vira administradora; as demais começam como visualizador.
          </Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingTop: spacing.xxl, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: spacing.xs },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  switch: { alignItems: 'center', padding: spacing.md },
  hint: { fontSize: 12, textAlign: 'center', marginTop: spacing.sm },
});
