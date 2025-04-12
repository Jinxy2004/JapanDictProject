import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useColorScheme } from 'react-native';

export function CustomDrawerContent({ navigation }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => navigation.navigate('(tabs)')}
      >
        <ThemedText style={styles.drawerText}>Dictionary</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => navigation.navigate('settings')}
      >
        <ThemedText style={styles.drawerText}>Settings</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerText: {
    fontSize: 16,
  }
});