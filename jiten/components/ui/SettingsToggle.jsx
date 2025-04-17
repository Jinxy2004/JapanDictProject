// components/DrawerToggle.tsx
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { useRouter } from 'expo-router';

export function SettingsToggle() {
  const router = useRouter();
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      onPress={() => router.push("/settings")}
      style={{ paddingHorizontal: 4 }}
    >
      <Ionicons name="settings-outline" size={24} color={theme ==="dark" ? '#fff' : "#000"} />
    </TouchableOpacity>
  );
}
