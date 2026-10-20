import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import FormField from '@/components/FormField';
import type { NewClientInput } from '@/services/clients';
import { formatCpf, isValidCpfLength, onlyDigits } from '@/utils/cpf';

interface ClientFormProps {
  initial?: Partial<NewClientInput>;
  submitLabel: string;
  saving: boolean;
  onSubmit: (values: NewClientInput) => void;
}

export default function ClientForm({ initial, submitLabel, saving, onSubmit }: ClientFormProps) {
  const { theme } = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [cpf, setCpf] = useState(formatCpf(initial?.cpf));
  const [address, setAddress] = useState(initial?.address ?? '');
  const [plan, setPlan] = useState(initial?.plan ?? '');

  const handleSubmit = () => {
    if (!name.trim() || !address.trim() || !plan.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios (marcados com *).');
      return;
    }
    if (!isValidCpfLength(cpf)) {
      Alert.alert('CPF inválido', 'O CPF deve ter exatamente 11 dígitos.');
      return;
    }
    // A API recebe apenas os dígitos; a máscara existe só na tela.
    onSubmit({ name, cpf: onlyDigits(cpf), plan, address });
  };

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Dados Pessoais</Text>
      <FormField
        label="Nome Completo *"
        placeholder="Ex: João da Silva"
        value={name}
        onChangeText={setName}
      />
      <FormField
        label="CPF"
        placeholder="000.000.000-00"
        value={cpf}
        onChangeText={(text) => setCpf(formatCpf(text))}
        keyboardType="number-pad"
        maxLength={14}
      />

      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: spacing.lg }]}>
        Endereço & Plano
      </Text>
      <FormField
        label="Endereço de Instalação *"
        placeholder="Rua, Número, Bairro"
        value={address}
        onChangeText={setAddress}
      />
      <FormField
        label="Plano Contratado *"
        placeholder="Ex: Fibra 600 Mega"
        value={plan}
        onChangeText={setPlan}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary, opacity: saving ? 0.6 : 1 }]}
        onPress={handleSubmit}
        disabled={saving}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        {saving ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Ionicons name="save-outline" size={20} color={colors.white} />
        )}
        <Text style={styles.saveButtonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
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
