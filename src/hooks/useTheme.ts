import { useColorScheme } from 'react-native';
import { colors } from '@/constants/theme';

export function useTheme() {
  const isDark = useColorScheme() === 'dark';
  return { isDark, theme: isDark ? colors.dark : colors.light };
}
