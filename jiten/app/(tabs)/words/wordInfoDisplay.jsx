import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import WordCard from '../../components/WordComponents/WordCard'
import { ThemeProvider } from '../../components/ThemeContext';

export default function WordInfoDisplayScreen() {
  const params = useLocalSearchParams();

  // Parse the JSON strings back into arrays
  const kanji_elements = JSON.parse(params.kanji_elements);
  const reading_elements = JSON.parse(params.reading_elements);
  const senses = JSON.parse(params.senses);

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <WordCard
          kanji_elements={kanji_elements}
          reading_elements={reading_elements}
          senses={senses}
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
});