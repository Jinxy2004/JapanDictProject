import React from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from "../ThemeContext";
import { ThemedText } from "../ThemedText";
import { useRouter } from 'expo-router';

// This is the card displays basic information about the searched up word
const WordSearchDisplayCard = ({
  // Takes in word  information and sets null values as a backup incase previous case failed
  kanji_elements = [],
  reading_elements = [],
  senses = []
}) => {
   const { theme, toggleTheme } = useTheme(); // useTheme is used to detect what mode the user is in, in order to change between a dark or light background
   const router = useRouter(); // Router to send the kanji information for the actual kanji card

   // More safety checks, as default parameters only work for undefined values not null values
   const safeKanji = Array.isArray(kanji_elements) ? kanji_elements : [];
   const safeReadings = Array.isArray(reading_elements) ? reading_elements : [];
   const safeSenses = Array.isArray(senses) ? senses : [];
  // Logging for test purposes
    // console.log('Kanji elements:', JSON.stringify(kanji_elements, null, 2));
    // console.log('Reading elements:', JSON.stringify(reading_elements, null, 2));
    // console.log('Senses:', JSON.stringify(senses, null, 2));
   const primaryKEB = safeKanji[0]?.keb_element || ''; // Uses optional chaining to handle some error instead of crashing
   const listReadings = safeReadings.flatMap(re => re.word_reading || []) // Flattens 2d array to 1d array
   const meanings = safeSenses.flatMap(sense => sense.gloss).filter(Boolean) // Goes through each object in the array and extracts the words form the gloss array and shoves it into a new one

   // More logging
  //  console.log("Primary keb is: ",primaryKEB);
  //  console.log("List readings are:", listReadings);
  //  console.log("Meanings are: ",meanings);
  // 

   const styles = StyleSheet.create({
    card: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
        padding: 8,
        borderWidth: 1,
        borderColor: theme === "dark" ? '#fff' : "#000",
        borderRadius: 8,
        backgroundColor: theme === "dark" ? '#3d3e3b' : "#ffffff",
    },
    kanjiHeader: {
        alignSelf: 'center',
        textAlign: "left",
        paddingRight: 8,
        justifyContent: 'center',
    },
    kanjiText: {
      fontSize: 24,
      paddingTop: ".5%",
      textAlign: 'left',
    },
    meaningText: {
      fontSize: 14,
    },
    readingText: {
      fontSize: 14,
      marginTop: -5,
    }
})

// Handles the press by pushing the word information to the kanjiInfoDisplay
const handleCardPress = () => {
  router.push({
    pathname: "/words/wordInfoDisplay",
    params: {
      kanji_elements: JSON.stringify(safeKanji),
      reading_elements: JSON.stringify(safeReadings),
      senses: JSON.stringify(safeSenses)
    }
  });
}

  return (
    // Creates a touchable button around the word displays so on press it will go to a wordCard
    <TouchableOpacity onPress={handleCardPress} style={{ width: '100%' }}>
      <View style={styles.card}>
        <View style={styles.kanjiHeader}>
          <ThemedText style={styles.kanjiText}>{primaryKEB}</ThemedText>
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.meaningText} numberOfLines={1} ellipsizeMode="clip" >{listReadings.join(', ')}</ThemedText>
          <ThemedText style={styles.readingText} numberOfLines={1} ellipsizeMode="clip">{meanings.join(', ')}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WordSearchDisplayCard;