import { View, StyleSheet, useColorScheme } from 'react-native';
import KanjiSearchBar from '../../components/KanjiComponents/KanjiSearchBar';
import { SQLiteProvider } from 'expo-sqlite';

export default function Tab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
        <KanjiSearchBar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
