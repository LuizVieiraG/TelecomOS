import React from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';
import type { UserProfile } from '@/types';

const ROLE_LABEL: Record<UserProfile['role'], string> = {
  admin: 'ADMINISTRADOR',
  technician: 'TÉCNICO',
  viewer: 'VISUALIZADOR',
};

const apiHost = API_URL.replace(/^https?:\/\//, '');

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { profile, signOut } = useAuth();

  const displayName = profile?.name || profile?.email || 'Usuário';
  const initials = displayName
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Card do Perfil */}
      <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]}>{displayName}</Text>
          <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{profile?.email}</Text>
          {profile ? (
            <View style={styles.roleTag}>
              <Text style={styles.roleText}>{ROLE_LABEL[profile.role]}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Configurações de Conexão */}
      <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>CONEXÃO & REDE</Text>
      <View style={[styles.menuGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="server-outline" size={20} color={colors.primary} />
            <Text style={[styles.menuLabel, { color: theme.text }]}>API</Text>
          </View>
          <Text style={[styles.menuValue, { color: theme.textSecondary }]}>{apiHost}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={[styles.menuLabel, { color: theme.text }]}>Sessão</Text>
          </View>
          <Text style={[styles.menuValue, { color: colors.success, fontWeight: '700' }]}>Autenticada</Text>
        </View>
      </View>

      {/* Paleta & Aparência */}
      <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>PALETA VISUAL</Text>
      <View style={[styles.menuGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.paletteRow}>
          <View style={styles.colorIndicator}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.primary }]} />
            <Text style={[styles.colorName, { color: theme.text }]}>Azul Telecom</Text>
          </View>

          <View style={styles.colorIndicator}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.black, borderWidth: 1, borderColor: '#334155' }]} />
            <Text style={[styles.colorName, { color: theme.text }]}>Preto</Text>
          </View>

          <View style={styles.colorIndicator}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.white, borderWidth: 1, borderColor: '#CBD5E1' }]} />
            <Text style={[styles.colorName, { color: theme.text }]}>Branco</Text>
          </View>
        </View>
      </View>

      {/* Informações do Sistema */}
      <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>SISTEMA OPERACIONAL</Text>
      <View style={[styles.menuGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="hardware-chip-outline" size={20} color={colors.primary} />
            <Text style={[styles.menuLabel, { color: theme.text }]}>Engine</Text>
          </View>
          <Text style={[styles.menuValue, { color: theme.textSecondary }]}>Hermes v0.86</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="cube-outline" size={20} color={colors.primary} />
            <Text style={[styles.menuLabel, { color: theme.text }]}>Versão TelecomOS</Text>
          </View>
          <Text style={[styles.menuValue, { color: theme.textSecondary }]}>v1.0.0 (Expo SDK 57)</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: colors.danger }]}
        onPress={signOut}
        accessibilityRole="button"
      >
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 6,
  },
  roleTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  menuGroup: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuValue: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginLeft: spacing.md,
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
  },
  colorIndicator: {
    alignItems: 'center',
    gap: 6,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorName: {
    fontSize: 11,
    fontWeight: '600',
  },
});
