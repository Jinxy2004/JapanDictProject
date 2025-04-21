import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from "../ThemeContext";
import { ThemedText } from "../ThemedText";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import { searchByKanji, returnKanjiDetailsByID } from "@/util/searchKanjiDictionary";
import KanjiSearchDisplayCard from "../KanjiComponents/KanjiSearchDisplayCard";
import { useSQLiteContext } from "expo-sqlite";
const wanakana = require('wanakana');

const WordCard = ({
  // takes in values and nulls out for fallback
  kanji_elements = [],
  reading_elements = [],
  senses = []
}) => {
  const db = useSQLiteContext();
   const{theme} = useTheme();
   const styles = getStyles(theme);
   const[kanji,setKanji] = useState([])
   const[searchResults,setSearchResults] = useState([])
  
  // Formats the dict references as they are objects within objects and need to be reformatted.

  // Helper functions
  function arePartsOfSpeechEqual() {
    if(senses.length < 2) return true; // If only one sense automatically equal

    const firstPOS = JSON.stringify(senses[0].parts_of_speech);
    
    return senses.every(sense => JSON.stringify(sense.parts_of_speech) === firstPOS);
  };

  function kanjiEleExists() {
    return kanji_elements.length > 0;
  }

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
    return ele.loanword_source.length > 0;
  }

  function restrReadingsExist(ele) {
    return ele.restricted_readings.length > 0;
  }

  function readingPriExists(ele) {
    return ele.reading_priorities.length > 0;
  }

  function readingInfoExists(ele) {
    return ele.reading_info.length > 0;
  }

  function kanjiInfoExists(ele) {
    return ele.kanji_info.length > 0;
  }

  function kanjiPriExists(ele) {
    return ele.kanji_priority.length > 0;
  }

  useEffect(() => {
    function getTokenizedKanji() {
      const allKanji = kanji_elements
        .map(val => val.keb_element)
        .join('')
        .split('')
        .filter(char => wanakana.isKanji(char));
      
      return [...new Set(allKanji)];
    }
    setKanji(getTokenizedKanji());
  },[kanji_elements]);

  useEffect(() => {
    const getKanjiResults = async () => {
      try {
        const kanjiPromises = kanji.map(singleKanji => 
          searchByKanji(singleKanji,db)
        )
      const kanjiIds = await Promise.all(kanjiPromises);
      const allKanjiIds = kanjiIds.flat()
      const kanjiInfo = await returnKanjiDetailsByID(allKanjiIds,db);
      setSearchResults(kanjiInfo);
      } catch(error) {
        console.error('Error searching for kanji in word card',error);
        setSearchResults([])
      }
    }
    if(kanji.length > 0) {
      getKanjiResults();
    }
  },[kanji]);

  



  return (
    // Displays a singular word information via dynamic rendering
    <GestureHandlerRootView style={styles.container}>
      <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#444' : '#ccc', width: '100%' }} />
      <View style={styles.card}>
        <ScrollView style={styles.scrollView}>
           {/* Handles all kanji information */}
           <View>
           {kanjiEleExists() && (
          <View style={styles.lineHeader}>
          <ThemedText type="defaultSemiBold">Kanji Info</ThemedText>
          </View>
          )}
            {kanji_elements.map(ele => (
              <View key={ele.id}>
                 {/* Handles keb elements */}
                 {<ThemedText>• {ele.keb_element}</ThemedText>}
                 {/* Handles kanji info */}
                 {kanjiInfoExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Kanji info: {ele.kanji_info.join(", ")}</ThemedText>
                 )}
                 {/* Handles kanji priority */}
                 {kanjiPriExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Kanji priority: {ele.kanji_priority.join(", ")}</ThemedText>
                 )}
              </View>
            ))}
           </View>
          {/* Handles all reading information */}
          <View>
          <View style={styles.lineHeader}>
            <ThemedText type="defaultSemiBold">Reading Info</ThemedText>
          </View>
            {reading_elements.map(ele => (
              <View key={ele.id}>
                {/* Handles each words readings */}
                {<ThemedText>• {ele.word_reading}</ThemedText>}
                {/* Handles the readings restricted to a specific kanji */}
                {restrReadingsExist(ele) && (
                <ThemedText style={styles.extraInfoText}>Reading restricted to: {ele.restricted_readings.join(", ")}</ThemedText>
                )}
                {/* Handles the the priority of each reading */}
                {readingPriExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Reading priority: {ele.reading_priorities.join(", ")}</ThemedText>
                )}
                {/* Handles the info for each reading */}
                {readingInfoExists(ele) && (
                  <ThemedText style={styles.extraInfoText}>Reading info: {ele.reading_info.join(", ")}</ThemedText>
                )}
              </View>
            ))}
          </View>
          <View style={styles.lineHeader}>
            <ThemedText type="defaultSemiBold">Word Info</ThemedText>
          </View>    
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
          <View style={styles.lineHeader}>
            <ThemedText type="defaultSemiBold">Kanji used</ThemedText>
          </View> 
          <View>
          {searchResults.map((kanji,index) => (
                <KanjiSearchDisplayCard 
                  key={index}
                  kanji={kanji.k_literal}
                  radical_num={kanji.radical_num}
                  grade_learned={kanji.grade_learned}
                  stroke_count={kanji.stroke_count}
                  app_frequency={kanji.app_frequency}
                  kanji_meanings={kanji.kanji_meanings}
                  ony_readings={kanji.ony_readings}
                  kun_readings={kanji.kun_readings}
                  dict_references={kanji.dict_references}
                />
              ))}
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  card: {
    flex: 1, 
    width: '100%',
    padding: 16, 
    backgroundColor: theme === "dark" ? '#000' : "#fff",
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
  },
  lineHeader: {
    flex: 1,
    width: "100%",
    height: 25,
    backgroundColor: theme === 'dark' ? 'rgba(220, 220, 220, .5)' : 'rgba(0,0,0,.5)',
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default WordCard;