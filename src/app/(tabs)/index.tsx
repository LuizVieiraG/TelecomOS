import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { getStats } from '@/services/stats';
import type { DashboardStats, MetricCardItem } from '@/types';
import MetricCard from '@/components/MetricCard';

// Monta os cartões a partir dos números que vieram da API.
function buildMetrics({ clients, orders }: DashboardStats): MetricCardItem[] {
  return [
    { id: '1', title: 'Clientes Ativos', value: `${clients.active} / ${clients.total}`, change: `${clients.online} com ONU online`, status: 'success' },
    { id: '2', title: 'Clientes Bloqueados', value: clients.blocked, change: `${clients.pending} pendentes`, status: clients.blocked > 0 ? 'warning' : 'normal' },
    { id: '3', title: 'OS Pendentes', value: orders.pending, change: `${orders.inProgress} em andamento`, status: 'normal' },
    { id: '4', title: 'OS Concluídas', value: orders.completed, change: `de ${orders.total} no total`, status: 'success' },
  ];
}

export default function DashboardScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { canWrite } = useAuth();

  // Estado para controlar a visibilidade das métricas (Requisito: useState)
  const [showMetrics, setShowMetrics] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setStats(await getStats());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Recarrega sempre que a aba ganha foco (ex.: depois de abrir uma OS).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const actions = [
    ...(canWrite
      ? [{ icon: 'add-circle-outline' as const, label: 'Abrir Nova OS', desc: 'Registrar chamado de instalação ou reparo', go: () => router.push('/new-order') }]
      : []),
    { icon: 'list-outline' as const, label: 'Ordens de Serviço', desc: 'Acompanhar chamados abertos e em andamento', go: () => router.push('/orders') },
    { icon: 'people-outline' as const, label: 'Buscar Assinante', desc: 'Consulta por nome, CPF ou endereço', go: () => router.push('/clients') },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      {/* Banner Principal com Azul Telecom e Branco */}
      <View style={[styles.heroCard, { backgroundColor: colors.black }]}>
        <View style={styles.heroHeader}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{error ? 'SEM CONEXÃO' : 'DADOS DA API'}</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Operação Central</Text>
        <Text style={styles.heroSubtitle}>
          Resumo de clientes e ordens de serviço, direto do banco de dados.
        </Text>

        <View style={styles.heroFooter}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{stats?.clients.active ?? '-'}</Text>
            <Text style={styles.heroStatLabel}>Assinantes Ativos</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{stats?.orders.inProgress ?? '-'}</Text>
            <Text style={styles.heroStatLabel}>OS em Campo</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{stats?.orders.urgent ?? '-'}</Text>
            <Text style={styles.heroStatLabel}>OS Urgentes</Text>
          </View>
        </View>
      </View>

      {loading ? <ActivityIndicator color={colors.primary} style={styles.feedback} /> : null}
      {error ? <Text style={[styles.feedback, { color: colors.danger }]}>{error}</Text> : null}

      {/* Cabeçalho da Seção de Métricas com Botão de Toggle */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Métricas da Rede</Text>
        <TouchableOpacity onPress={() => setShowMetrics(!showMetrics)} style={styles.toggleButton}>
          <Text style={[styles.toggleText, { color: colors.primary }]}>
            {showMetrics ? 'Ocultar' : 'Mostrar'}
          </Text>
          <Ionicons name={showMetrics ? 'chevron-up' : 'chevron-down'} size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Seção de Métricas */}
      {showMetrics && stats && (
        <View style={styles.metricsGrid}>
          {buildMetrics(stats).map((item) => (
            <MetricCard key={item.id} item={item} theme={theme} />
          ))}
        </View>
      )}

      {/* Ações Rápidas */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Ações Rápidas</Text>
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.label}
            activeOpacity={0.7}
            onPress={action.go}
            style={[
              styles.actionItem,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name={action.icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.actionTextWrapper}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>{action.label}</Text>
              <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>{action.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 102, 255, 0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  liveText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  feedback: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  heroStatLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#1E293B',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionsContainer: {
    gap: spacing.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  actionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionTextWrapper: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
  },
});
