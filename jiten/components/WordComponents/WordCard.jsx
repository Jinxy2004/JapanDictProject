import React from "react";
import { View, StyleSheet } from 'react-native';
import { useTheme } from "../ThemeContext";
import { ThemedText } from "../ThemedText";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";

const WordCard = ({
  // takes in values and nulls out for fallback
  kanji_elements = [],
  reading_elements = [],
  senses = []
}) => {
   const{theme, toggleTheme} = useTheme();
    // Logging for test purposes
    console.log("Hello");
    console.log('Kanji elements:', JSON.stringify(kanji_elements, null, 2));
    console.log('Reading elements:', JSON.stringify(reading_elements, null, 2));
    console.log('Senses:', JSON.stringify(senses, null, 2));
    
   const primaryKEB = kanji_elements[0]?.keb || '';
   const listReadings = reading_elements.flatMap(re => re.reb || []) // Flattens 2d array to 1d array
   const meanings = senses.flatMap(sense => 
    sense.gloss?.map(g => g.word_info) || []
   ).filter(Boolean)

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
  
  



  return (
    // Displays a singular word information 
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.card}>
        <ScrollView style={styles.scrollView}>
            <ThemedText>KEB: {primaryKEB}</ThemedText>
            <ThemedText>List Readings: {listReadings}</ThemedText>
            <ThemedText>Senses: {meanings}</ThemedText>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default WordCard;