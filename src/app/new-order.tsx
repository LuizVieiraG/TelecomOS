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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import ChoiceChips from '@/components/ChoiceChips';
import FormField from '@/components/FormField';
import { createOrder } from '@/services/orders';
import { SERVICE_TYPES, type ServiceOrder } from '@/types';

const SERVICE_OPTIONS = SERVICE_TYPES.map((value) => ({ value, label: value }));
const PRIORITY_OPTIONS = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
] as const;

export default function NewOrderScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [serviceType, setServiceType] = useState<ServiceOrder['serviceType']>(SERVICE_TYPES[0]);
  const [priority, setPriority] = useState<ServiceOrder['priority']>('media');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!clientName.trim() || !address.trim() || !scheduledTime.trim()) {
      Alert.alert('Erro', 'Preencha cliente, endereço e horário (campos marcados com *).');
      return;
    }
    setSaving(true);
    try {
      await createOrder({ clientName, address, scheduledTime, serviceType, priority });
      Alert.alert('Sucesso', 'Ordem de serviço criada!', [
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
        <FormField
          label="Cliente *"
          placeholder="Ex: Mariana Lima"
          value={clientName}
          onChangeText={setClientName}
        />
        <FormField
          label="Endereço *"
          placeholder="Rua, Número, Bairro"
          value={address}
          onChangeText={setAddress}
        />
        <FormField
          label="Horário agendado *"
          placeholder="Ex: Hoje, 14:00"
          value={scheduledTime}
          onChangeText={setScheduledTime}
        />

        <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>TIPO DE SERVIÇO</Text>
        <ChoiceChips options={SERVICE_OPTIONS} value={serviceType} onChange={setServiceType} />

        <Text style={[styles.groupTitle, { color: theme.textSecondary, marginTop: spacing.lg }]}>
          PRIORIDADE
        </Text>
        <ChoiceChips options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary, opacity: saving ? 0.6 : 1 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Ionicons name="save-outline" size={20} color={colors.white} />
          )}
          <Text style={styles.saveButtonText}>Criar OS</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md },
  groupTitle: { fontSize: 12, fontWeight: '700', marginBottom: spacing.sm },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  saveButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
