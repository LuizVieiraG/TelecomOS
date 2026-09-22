import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';
import type { ServiceOrder } from '@/types';

const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'OS-2041',
    clientName: 'Roberto Carvalho',
    serviceType: 'Instalação Fibra',
    address: 'Av. Paulista, 1240 - Apto 82',
    status: 'pending',
    priority: 'alta',
    scheduledTime: 'Hoje, 14:00',
  },
  {
    id: 'OS-2042',
    clientName: 'Clinica Médica Central',
    serviceType: 'Reparo de Sinal',
    address: 'Rua Augusta, 510 - Sala 3',
    status: 'in_progress',
    priority: 'alta',
    scheduledTime: 'Hoje, 15:30',
  },
  {
    id: 'OS-2043',
    clientName: 'Mariana Lima',
    serviceType: 'Troca de Roteador',
    address: 'Rua Bela Cintra, 890',
    status: 'pending',
    priority: 'media',
    scheduledTime: 'Hoje, 17:00',
  },
  {
    id: 'OS-2040',
    clientName: 'Supermercado Nova Era',
    serviceType: 'Manutenção Preventiva',
    address: 'Av. Brigadeiro Luis Antonio, 2100',
    status: 'completed',
    priority: 'baixa',
    scheduledTime: 'Ontem, 16:20',
  },
];

export default function OrdersScreen() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const filteredOrders = INITIAL_ORDERS.filter((order) => {
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
          {[
            { id: 'all', label: 'Todas (4)' },
            { id: 'pending', label: 'Pendentes (2)' },
            { id: 'in_progress', label: 'Em Rota (1)' },
            { id: 'completed', label: 'Concluídas (1)' },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setFilter(tab.id as any)}
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
                >
                  <Text style={styles.primaryActionBtnText}>Ver Detalhes</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
