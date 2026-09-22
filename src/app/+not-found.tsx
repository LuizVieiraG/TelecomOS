import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Página não encontrada</Text>
        <Text style={styles.subtitle}>O caminho requisitado não existe.</Text>

        <Link href="/(tabs)/index" style={styles.link}>
          <Text style={styles.linkText}>Voltar para o Início</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: spacing.lg,
  },
  link: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
