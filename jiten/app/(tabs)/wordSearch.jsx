import { View, useColorScheme, StyleSheet } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import WordSearchBar from '../../components/WordComponents/WordSearchBar';

export default function Tab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
      <SQLiteProvider databaseName='entireDict.db' assetSource={{ assetId: require('../../assets/database/entireDict.db')}}>
        <WordSearchBar/>
      </SQLiteProvider>
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
