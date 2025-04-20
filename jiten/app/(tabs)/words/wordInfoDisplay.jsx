import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import WordCard from '../../../components/WordComponents/WordCard'

export default function WordInfoDisplayScreen() {
  const params = useLocalSearchParams();

  // Parse the JSON strings back into arrays
  let kanji_elements;
  let reading_elements;
  let senses;
  try {
     kanji_elements = JSON.parse(params.kanji_elements);
     reading_elements = JSON.parse(params.reading_elements);
     senses = JSON.parse(params.senses);
  } catch(error) {
    console.error("Error in wordInfoDisplay parsing: ", error);
  }

  return (
      <View style={styles.container}>
        <WordCard
          kanji_elements={kanji_elements}
          reading_elements={reading_elements}
          senses={senses}
        />
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
});