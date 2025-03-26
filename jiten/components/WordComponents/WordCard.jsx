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
    console.log('Kanji elements:', JSON.stringify(kanji_elements, null, 2));
    console.log('Reading elements:', JSON.stringify(reading_elements, null, 2));
    console.log('Senses:', JSON.stringify(senses, null, 2));
   
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
    extraInfoText: {
      marginLeft: 16,
      color: theme === "dark" ? "#a0a0a0" : "#666666" ,
      fontSize: 12,
    }
  });
  // Formats the dict references as they are objects within objects and need to be reformatted.

  // Helper functions
  function arePartsOfSpeechEqual() {
    if(senses.length < 2) return true; // If only one sense automatically equal

    const firstPOS = JSON.stringify(senses[0].parts_of_speech);
    
    return senses.every(sense => JSON.stringify(sense.parts_of_speech) === firstPOS);
  };

  function stagRorKExists(ele) {
    return ele.stagk.length > 0 || ele.stagr.length > 0;
  };

  function antonymsExists(ele) {
    return ele.antonyms.length > 0;
  }

  function senseInfoExists(ele) {
    return ele.sense_info.length > 0;
  }
  
  function dialectExists(ele) {
    return ele.dialect.length > 0;
  }

  function fieldExists(ele) {
    return ele.field.length > 0;
  }

  function crossRefExists(ele) {
    return ele.cross_reference.length > 0;
  }

  function miscExists(ele) {
    return ele.misc.length > 0;
  }

  function loanwordExists(ele) {
    return ele.loanword_source > 0;
  }
  



  return (
    // Displays a singular word information 
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.card}>
        <ScrollView style={styles.scrollView}>
          <ThemedText>KEB: {kanji_elements.map(ele => ele.keb_element)}</ThemedText>
          <ThemedText>Readings: {reading_elements.map(ele => ele.word_reading)}</ThemedText>
          <ThemedText>Senses: </ThemedText> 
          <View>
            {/* Handles all sense information */}
            {senses.map(ele => (
              <View key={ele.id}>
                {/* Handles gloss terms and extra information via conditionals */}
                <ThemedText>• {ele.gloss.join(", ")}</ThemedText>
                {/* Handles whether or not a meaning is tied to a specific reading or kanji */}
                {stagRorKExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>
                    Meaning only applies to: {[...ele.stagk.join(", "), ...ele.stagr.join(", ")]}
                  </ThemedText>
                )}
                {/* Handles whether or not an antonym exists */}
                {antonymsExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Antonyms: {ele.antonyms.join(", ")}</ThemedText>
                )}
                {/* Handles extra info about the senses */}
                {senseInfoExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Extra info: {ele.sense_info.join(", ")}</ThemedText>
                )}
                {/* Handles dialect info */}
                {dialectExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Dialect: {ele.dialect.join(", ")}</ThemedText>
                )}
                {/* Handles info about where word is commonly used */}
                {fieldExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Field: {ele.field.join(", ")}</ThemedText>
                )}
                {/* Handles cross references */}
                {crossRefExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Cross references: {ele.cross_reference.join(", ")}</ThemedText>
                )}
                {/* Handles misc info */}
                {miscExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Misc: {ele.misc.join(", ")}</ThemedText>
                )}
                {/* Handles loanword sources */}
                {loanwordExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Loanword source: {ele.loanword_source.join(", ")}</ThemedText>
                )}
                {!arePartsOfSpeechEqual() && (
                  // The && operator here is used as shorthand ternary operator to conditionally render components.
                  <ThemedText style={styles.extraInfoText}>
                    {ele.parts_of_speech.join(", ")}
                  </ThemedText>
                )}
                
              </View>
            ))}
            {arePartsOfSpeechEqual() && senses.length > 0 && (
              // This one also conditionally renders the parts of speech if they were all the same
              <ThemedText style={styles.extraInfoText}>
                {senses[0].parts_of_speech.join(", ")}
              </ThemedText>
            )}
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default WordCard;