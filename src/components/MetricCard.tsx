import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';
import type { MetricCardItem } from '@/types';

// Propriedades do componente (Uso de props obrigatório para o Checkpoint 1)
interface MetricCardProps {
  item: MetricCardItem;
  theme: {
    text: string;
    textSecondary: string;
    surface: string;
    border: string;
  };
}

export default function MetricCard({ item, theme }: MetricCardProps) {
  return (
    <View
      style={[
        styles.metricCard,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.metricTitle, { color: theme.textSecondary }]}>
        {item.title}
      </Text>
      <Text style={[styles.metricValue, { color: theme.text }]}>{item.value}</Text>
      <View style={styles.changeRow}>
        <Ionicons
          name={item.status === 'warning' ? 'alert-circle' : 'trending-up'}
          size={14}
          color={item.status === 'warning' ? colors.warning : colors.primary}
        />
        <Text
          style={[
            styles.metricChange,
            { color: item.status === 'warning' ? colors.warning : colors.primary },
          ]}
        >
          {item.change}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metricCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
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
});
