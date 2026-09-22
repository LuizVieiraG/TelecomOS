import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@/constants/theme';
import type { ClientItem } from '@/types';

const CLIENTS_DATA: ClientItem[] = [
  {
    id: 'CLI-101',
    name: 'Carlos Eduardo Santos',
    plan: 'Fibra 600 Mega Pro',
    speed: '600 Mbps',
    status: 'active',
    address: 'Rua Oscar Freire, 1420',
    onuStatus: 'online',
  },
  {
    id: 'CLI-102',
    name: 'Tech Solutions Consultoria',
    plan: 'Link Dedicado 1 Gbps',
    speed: '1000 Mbps',
    status: 'active',
    address: 'Av. Faria Lima, 3477',
    onuStatus: 'online',
  },
  {
    id: 'CLI-103',
    name: 'Juliana Fernandes',
    plan: 'Fibra 400 Mega Residencial',
    speed: '400 Mbps',
    status: 'pending',
    address: 'Rua Pamplona, 630',
    onuStatus: 'offline',
  },
  {
    id: 'CLI-104',
    name: 'Padaria & Confeitaria Central',
    plan: 'Fibra 500 Mega Comercial',
    speed: '500 Mbps',
    status: 'blocked',
    address: 'Rua Haddock Lobo, 915',
    onuStatus: 'offline',
  },
];

export default function ClientsScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const filteredClients = CLIENTS_DATA.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Barra de Busca */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
          <TextInput
            placeholder="Buscar por nome, plano ou contrato..."
            placeholderTextColor={theme.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={[styles.searchInput, { color: theme.text }]}
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Lista de Clientes */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.counterText, { color: theme.textSecondary }]}>
          Exibindo {filteredClients.length} assinantes
        </Text>

        {filteredClients.map((client) => {
          const isOnline = client.onuStatus === 'online';
          return (
            <View
              key={client.id}
              style={[
                styles.clientCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.clientName, { color: theme.text }]}>{client.name}</Text>
                  <Text style={[styles.clientId, { color: theme.textSecondary }]}>{client.id}</Text>
                </View>
                <View style={styles.onuBadge}>
                  <View
                    style={[
                      styles.onuDot,
                      { backgroundColor: isOnline ? colors.success : colors.danger },
                    ]}
                  />
                  <Text
                    style={[
                      styles.onuText,
                      { color: isOnline ? colors.success : colors.danger },
                    ]}
                  >
                    ONU {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </Text>
                </View>
              </View>

              <View style={[styles.planBadge, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="speedometer-outline" size={14} color={colors.primary} />
                <Text style={styles.planBadgeText}>{client.plan}</Text>
              </View>

              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.addressText, { color: theme.textSecondary }]}>{client.address}</Text>
              </View>

              <View style={[styles.actionRow, { borderTopColor: theme.border }]}>
                <TouchableOpacity style={styles.textBtn}>
                  <Ionicons name="pulse-outline" size={16} color={colors.primary} />
                  <Text style={styles.textBtnTitle}>Sinal Óptico</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.manageBtn, { backgroundColor: colors.black }]}
                >
                  <Text style={styles.manageBtnText}>Gerenciar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/new-client' as any)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: -4,
  },
  clientCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
  },
  clientId: {
    fontSize: 12,
    marginTop: 2,
  },
  onuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
  onuDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  onuText: {
    fontSize: 10,
    fontWeight: '700',
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  planBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  addressText: {
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  textBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textBtnTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  manageBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  manageBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
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
});
