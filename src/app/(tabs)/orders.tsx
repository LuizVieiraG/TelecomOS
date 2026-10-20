import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@/constants/theme';
import type { ServiceOrder } from '@/types';
import { useAsyncList } from '@/hooks/useAsyncList';
import { listOrders } from '@/services/orders';
import { useAuth } from '@/context/AuthContext';

type OrderFilter = 'all' | ServiceOrder['status'];

export default function OrdersScreen() {
  const router = useRouter();
  const { canWrite } = useAuth();
  const [filter, setFilter] = useState<OrderFilter>('all');
  const { items: orders, loading, error } = useAsyncList(listOrders);
  const countBy = (status: ServiceOrder['status']) => orders.filter((o) => o.status === status).length;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusBadge = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'in_progress':
        return { label: 'Em Andamento', bg: colors.primaryLight, text: colors.primary };
      case 'completed':
        return { label: 'Concluída', bg: '#DCFCE7', text: colors.success };
      case 'pending':
      default:
        return { label: 'Pendente', bg: '#FEF3C7', text: colors.warning };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Filtros em Chips */}
      <View style={[styles.filterBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {([
            { id: 'all', label: `Todas (${orders.length})` },
            { id: 'pending', label: `Pendentes (${countBy('pending')})` },
            { id: 'in_progress', label: `Em Andamento (${countBy('in_progress')})` },
            { id: 'completed', label: `Concluídas (${countBy('completed')})` },
          ] satisfies { id: OrderFilter; label: string }[]).map((tab) => {
            const active = filter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setFilter(tab.id)}
                style={[
                  styles.filterChip,
                  active
                    ? { backgroundColor: colors.black, borderColor: colors.black }
                    : { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active ? { color: colors.white } : { color: theme.textSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Ordens */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} /> : null}
        {error ? (
          <Text style={{ color: colors.danger }}>Não foi possível carregar as ordens: {error}</Text>
        ) : null}
        {filteredOrders.map((order) => {
          const badge = getStatusBadge(order.status);
          return (
            <View
              key={order.id}
              style={[
                styles.orderCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.osIdBox}>
                  <Text style={styles.osIdText}>{order.id}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: badge.text }]}>{badge.label}</Text>
                </View>
              </View>

              <Text style={[styles.clientName, { color: theme.text }]}>{order.clientName}</Text>
              
              <View style={styles.infoRow}>
                <Ionicons name="construct-outline" size={15} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.primary, fontWeight: '600' }]}>
                  {order.serviceType}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={15} color={theme.textSecondary} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>{order.address}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={15} color={theme.textSecondary} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>{order.scheduledTime}</Text>
              </View>

              <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
                  onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryActionBtnText}>Ver Detalhes</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {canWrite ? (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/new-order')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Nova ordem de serviço"
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterBar: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  filterScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  orderCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  osIdBox: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  osIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
  },
  cardFooter: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
  },
  primaryActionBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
