import React, { useCallback, useEffect, useState } from 'react';
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
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import ChoiceChips from '@/components/ChoiceChips';
import ClientForm from '@/components/ClientForm';
import {
  deleteClient,
  getClient,
  updateClient,
  type ClientPatch,
} from '@/services/clients';
import { formatCpf } from '@/utils/cpf';
import type { ClientItem } from '@/types';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Ativo' },
  { value: 'pending', label: 'Pendente' },
  { value: 'blocked', label: 'Bloqueado' },
] as const;

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { canWrite, canDelete } = useAuth();

  const [client, setClient] = useState<ClientItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getClient(id)
      .then((data) => active && setClient(data))
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Erro desconhecido'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const save = useCallback(
    async (patch: ClientPatch) => {
      setSaving(true);
      try {
        setClient(await updateClient(id, patch));
        setEditing(false);
      } catch (e) {
        Alert.alert('Erro ao salvar', e instanceof Error ? e.message : 'Tente novamente.');
      } finally {
        setSaving(false);
      }
    },
    [id],
  );

  const confirmDelete = () => {
    Alert.alert('Excluir cliente', 'Esta ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteClient(id);
            router.back();
          } catch (e) {
            Alert.alert('Erro ao excluir', e instanceof Error ? e.message : 'Tente novamente.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error || !client) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: colors.danger }}>{error ?? 'Cliente não encontrado.'}</Text>
      </View>
    );
  }

  const isOnline = client.onuStatus === 'online';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: editing ? 'Editar Cliente' : client.name }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {editing ? (
          <ClientForm
            initial={client}
            submitLabel="Salvar Alterações"
            saving={saving}
            onSubmit={(values) => save(values)}
          />
        ) : (
          <>
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.name, { color: theme.text }]}>{client.name}</Text>
              <Text style={[styles.code, { color: theme.textSecondary }]}>{client.id}</Text>

              <InfoRow icon="speedometer-outline" text={`${client.plan} (${client.speed || '—'})`} />
              <InfoRow icon="location-outline" text={client.address} />
              {client.cpf ? <InfoRow icon="card-outline" text={formatCpf(client.cpf)} /> : null}
              <InfoRow
                icon="pulse-outline"
                text={`ONU ${isOnline ? 'online' : 'offline'}`}
                color={isOnline ? colors.success : colors.danger}
              />
            </View>

            <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>STATUS DO CONTRATO</Text>
            <ChoiceChips
              options={STATUS_OPTIONS}
              value={client.status}
              disabled={saving || !canWrite}
              onChange={(status) => save({ status })}
            />

            {canWrite ? (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => setEditing(true)}
                accessibilityRole="button"
              >
                <Ionicons name="create-outline" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Editar dados</Text>
              </TouchableOpacity>
            ) : null}

            {canDelete ? (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.danger }]}
                onPress={confirmDelete}
                accessibilityRole="button"
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
                <Text style={[styles.buttonText, { color: colors.danger }]}>Excluir cliente</Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InfoRow({
  icon,
  text,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
  color?: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={color ?? theme.textSecondary} />
      <Text style={[styles.infoText, { color: color ?? theme.textSecondary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  content: { padding: spacing.md },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  name: { fontSize: 20, fontWeight: '700' },
  code: { fontSize: 13, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  infoText: { fontSize: 14, flex: 1 },
  groupTitle: { fontSize: 12, fontWeight: '700', marginBottom: spacing.sm },
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
});
