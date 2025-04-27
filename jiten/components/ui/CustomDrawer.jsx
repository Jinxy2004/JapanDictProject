import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useTheme } from '../ThemeContext';
import { useRouter } from 'expo-router';

export function CustomDrawerContent({ navigation }) {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => router.push('/')}
      >
        <ThemedText style={styles.drawerText}>Home page</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => router.push('/(tabs)/(mainTabs)')}
      >
        <ThemedText style={styles.drawerText}>Dictionary</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => router.push('(tabs)/settings')}
      >
        <ThemedText style={styles.drawerText}>Settings</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => router.push('(tabs)/wordLists')}
      >
        <ThemedText style={styles.drawerText}>Word Lists</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => router.push('(tabs)/aboutUs')}
      >
        <ThemedText style={styles.drawerText}>About Us</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
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