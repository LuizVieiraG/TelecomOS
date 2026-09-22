import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';

export default function NewClientScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  // Estados do formulário (requisito: useState)
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [plan, setPlan] = useState('');
  const [cpf, setCpf] = useState('');

  const handleSave = () => {
    // Validação simples
    if (!name || !address || !plan) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios (marcados com *).');
      return;
    }

    // Aqui seria a integração com o back-end ou um estado global
    // Por enquanto apenas exibe o alerta simulando sucesso.
    Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Novo Cliente' }} />
      
      <View style={styles.formSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Dados Pessoais</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Nome Completo *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Ex: João da Silva"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>CPF / CNPJ</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="000.000.000-00"
            placeholderTextColor={theme.textSecondary}
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: spacing.lg }]}>Endereço & Plano</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Endereço de Instalação *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Rua, Número, Bairro"
            placeholderTextColor={theme.textSecondary}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Plano Contratado *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Ex: Fibra 600 Mega"
            placeholderTextColor={theme.textSecondary}
            value={plan}
            onChangeText={setPlan}
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Ionicons name="save-outline" size={20} color={colors.white} />
          <Text style={styles.saveButtonText}>Salvar Cadastro</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: 15,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
