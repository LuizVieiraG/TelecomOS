import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { deleteOrder, getOrder, updateOrderStatus } from '@/services/orders';
import type { ServiceOrder } from '@/types';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'completed', label: 'Concluída' },
] as const;

const PRIORITY_LABEL: Record<ServiceOrder['priority'], string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { canWrite, canDelete } = useAuth();

  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getOrder(id)
      .then((data) => active && setOrder(data))
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Erro desconhecido'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const changeStatus = async (status: ServiceOrder['status']) => {
    setSaving(true);
    try {
      setOrder(await updateOrderStatus(id, status));
    } catch (e) {
      Alert.alert('Erro ao atualizar', e instanceof Error ? e.message : 'Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert('Excluir ordem de serviço', 'Esta ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteOrder(id);
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

  if (error || !order) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: colors.danger }}>{error ?? 'Ordem de serviço não encontrada.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ title: order.id }} />

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.name, { color: theme.text }]}>{order.clientName}</Text>
        <Row icon="construct-outline" text={order.serviceType} color={colors.primary} />
        <Row icon="location-outline" text={order.address} />
        <Row icon="time-outline" text={order.scheduledTime} />
        <Row icon="flag-outline" text={`Prioridade ${PRIORITY_LABEL[order.priority]}`} />
      </View>

      <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>STATUS DA OS</Text>
      <ChoiceChips
        options={STATUS_OPTIONS}
        value={order.status}
        disabled={saving || !canWrite}
        onChange={changeStatus}
      />

      {canDelete ? (
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: colors.danger }]}
          onPress={confirmDelete}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text style={styles.deleteText}>Excluir ordem de serviço</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

function Row({
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
  name: { fontSize: 20, fontWeight: '700', marginBottom: spacing.xs },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  infoText: { fontSize: 14, flex: 1 },
  groupTitle: { fontSize: 12, fontWeight: '700', marginBottom: spacing.sm },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  deleteText: { color: colors.danger, fontSize: 16, fontWeight: '600' },
});
