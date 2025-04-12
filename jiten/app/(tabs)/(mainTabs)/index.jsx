import { View, StyleSheet } from 'react-native';
import KanjiSearchBar from '../../../components/KanjiComponents/KanjiSearchBar';
import { useTheme } from '@/components/ThemeContext';

export default function Tab() {
  const {theme} = useTheme();
  const isDark = theme === 'dark';

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