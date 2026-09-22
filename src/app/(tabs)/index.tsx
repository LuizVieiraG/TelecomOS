import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';
import type { MetricCardItem } from '@/types';
import MetricCard from '@/components/MetricCard';

const METRICS: MetricCardItem[] = [
  { id: '1', title: 'Disponibilidade', value: '99.98%', change: '+0.02%', status: 'success' },
  { id: '2', title: 'Nós Ativos', value: '142 / 144', change: '2 offline', status: 'warning' },
  { id: '3', title: 'Latência Média', value: '12 ms', change: '-3 ms', status: 'success' },
  { id: '4', title: 'Tráfego Atual', value: '8.4 Gbps', change: 'Pico normal', status: 'normal' },
];

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  // Estado para controlar a visibilidade das métricas (Requisito: useState)
  const [showMetrics, setShowMetrics] = useState(true);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner Principal com Azul Telecom e Branco */}
      <View style={[styles.heroCard, { backgroundColor: colors.black }]}>
        <View style={styles.heroHeader}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>BACKBONE ONLINE</Text>
          </View>
          <Text style={styles.heroTime}>192.168.5.4</Text>
        </View>

        <Text style={styles.heroTitle}>Operação Central</Text>
        <Text style={styles.heroSubtitle}>
          Monitoramento em tempo real de infraestrutura de fibra e roteamento.
        </Text>

        <View style={styles.heroFooter}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>1.420</Text>
            <Text style={styles.heroStatLabel}>Assinantes Ativos</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>18</Text>
            <Text style={styles.heroStatLabel}>OS em Campo</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>0</Text>
            <Text style={styles.heroStatLabel}>Incidentes Críticos</Text>
          </View>
        </View>
      </View>

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
      {showMetrics && (
        <View style={styles.metricsGrid}>
          {METRICS.map((item) => (
            <MetricCard key={item.id} item={item} theme={theme} />
          ))}
        </View>
      )}

      {/* Ações Rápidas */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Ações Rápidas</Text>
      <View style={styles.actionsContainer}>
        {[
          { icon: 'add-circle-outline' as const, label: 'Abrir Nova OS', desc: 'Registrar chamado de instalação ou reparo' },
          { icon: 'pulse-outline' as const, label: 'Teste de Conexão', desc: 'Ping e medição de latência nos nós' },
          { icon: 'people-outline' as const, label: 'Buscar Assinante', desc: 'Consulta por CPF, contrato ou endereço' },
        ].map((action, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
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
  heroTime: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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
  metricCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
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
