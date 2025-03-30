import React from "react";
import { View, StyleSheet } from 'react-native';
import { useTheme } from "../ThemeContext";
import { ThemedText } from "../ThemedText";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";

const KanjiCard = ({
  // takes in values and nulls out for fallback
  kanji,
  radical_num,
  grade_learned, // Can be null
  stroke_count,
  app_frequency, // Can be null
  rad_name, // Can be null
  JLPT_level, // Can be null
  kanji_meanings = [],
  ony_readings = [],
  kun_readings = [],
  dict_references = [],
}) => {
   const{theme, toggleTheme} = useTheme();

   const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    card: {
      flex: 1, 
      width: '100%',
      padding: 16, 
      backgroundColor: theme === "dark" ? '#3d3e3b' : "#ffffff",
    },
    kanjiHeader: {
      fontSize: 24,
      marginBottom: 16, 
    },
    scrollView: {
      flex: 1, 
    },
  });
  // Formats the dict references as they are objects within objects and need to be reformatted.
  const formatDictReferences = (references) => {
    return references.map((ref,index) => (
      <ThemedText key={index}>
        {ref.type}: {ref.value}
      </ThemedText>
    ));
  };

  // Helper functions
  function radNameExists() {
    return rad_name !== null && rad_name !== undefined && rad_name !== '';
  }

  function JLPTLevelExists() {
    return JLPT_level !== null && JLPT_level !== undefined && JLPT_level !== '';
  }
  function appFrequencyExists() {
    return app_frequency !== null && app_frequency !== undefined && app_frequency !== '';
  }
  function gradeLearnedExists() {
    return grade_learned !== null && grade_learned !== undefined && grade_learned !== '';
  }
  return (
    // Displays a singular kanji information 
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.card}>
        <ScrollView style={styles.scrollView}>
          <ThemedText style={styles.kanjiHeader}>{kanji}</ThemedText>
          <ThemedText>Radical number: {radical_num}</ThemedText>
          <ThemedText>Stroke count: {stroke_count}</ThemedText>
          {/* Dynamic rendering to only show if the values exist */}
          {radNameExists() && (
            <ThemedText>Radical name: {rad_name}</ThemedText>
          )}
          {JLPTLevelExists() && (
            <ThemedText>JLPT level: {JLPT_level}</ThemedText>
          )}
          {appFrequencyExists() && (
            <ThemedText>Appearance frequency: {app_frequency}</ThemedText>
          )}
          {gradeLearnedExists() && (
            <ThemedText>Grade learned: {grade_learned}</ThemedText>
          )}
          <ThemedText>Meanings: {kanji_meanings.join(', ')}</ThemedText>
          <ThemedText>Ony readings: {ony_readings.join(', ')}</ThemedText>
          <ThemedText>Kun readings: {kun_readings.join(', ')}</ThemedText>
          <ThemedText>Dict references: </ThemedText>
          {formatDictReferences(dict_references)}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default KanjiCard;