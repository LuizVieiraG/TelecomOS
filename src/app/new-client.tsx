import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import ClientForm from '@/components/ClientForm';
import { createClient, type NewClientInput } from '@/services/clients';

export default function NewClientScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values: NewClientInput) => {
    setSaving(true);
    try {
      await createClient(values);
      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Erro ao salvar', e instanceof Error ? e.message : 'Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ClientForm submitLabel="Salvar Cadastro" saving={saving} onSubmit={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
});
