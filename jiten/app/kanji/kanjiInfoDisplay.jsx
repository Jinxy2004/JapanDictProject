import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import KanjiCard from '../../components/KanjiCard';
import { ThemeProvider } from '../../components/ThemeContext';

export default function KanjiDetailScreen() {
  const params = useLocalSearchParams();

  // Parse the JSON strings back into arrays
  const kanji_meanings = JSON.parse(params.kanji_meanings);
  const ony_readings = JSON.parse(params.ony_readings);
  const kun_readings = JSON.parse(params.kun_readings);
  const dict_references = JSON.parse(params.dict_references);

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <KanjiCard
          kanji={params.id}
          kanji_meanings={kanji_meanings}
          ony_readings={ony_readings}
          kun_readings={kun_readings}
          radical_num={params.radical_num}
          grade_learned={params.grade_learned}
          stroke_count={params.stroke_count}
          app_frequency={params.app_frequency}
          rad_name={params.rad_name}
          JLPT_level={params.JLPT_level}
          dict_references={dict_references}
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