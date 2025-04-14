// components/DrawerToggle.tsx
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

export function DrawerToggle() {
  const navigation = useNavigation();
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ paddingHorizontal: 4 }}
    >
      <Ionicons name="menu" size={24} color={theme ==="dark" ? '#fff' : "#000"} />
    </TouchableOpacity>
  );
}
