// components/DrawerToggle.tsx
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function DrawerToggle() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ paddingHorizontal: 16 }}
    >
      <Ionicons name="menu" size={24} color="white" />
    </TouchableOpacity>
  );
}
