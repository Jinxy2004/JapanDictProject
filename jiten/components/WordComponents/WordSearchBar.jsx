import React, { useCallback, useState } from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { searchByReadingElement, searchByGloss, serachByKanjiElement, fetchEntryDetails, checkDB } from '../../util/searchWordDictionary.js';
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import { useSQLiteContext } from "expo-sqlite";
import WordSearchDisplayCard from "./WordSearchDisplayCard.jsx";
import { useTheme } from "../ThemeContext";
const debounce = require('debounce');
const wanakana = require('wanakana');

const WordSearchBar = () => {
  const db = useSQLiteContext();
  // The value inside of useState is the initial value, the first value inside of the [] isr the current value and the second
  // value is a function that lets you update the current value and re-render
    const[searchText, setSearchText] = useState('') // This stores the input values
    const[searchResults, setSearchResults] = useState([]) // This stores the resulting array of searches
    const {theme} = useTheme();
    const styles = getStyles(theme)

    const debouncedSearch = useCallback(
    debounce(async (text) => {
      let results = "";
        try {
          const startTime = performance.now();
          console.log("Current input is: ",text)
          if(!wanakana.isJapanese(text) && !wanakana.isJapanese(wanakana.toHiragana(text))) {
            console.log("Searching in first")
            const ent_ids = await searchByGloss(text,db);
            results = await fetchEntryDetails(ent_ids,db);
          } else if (wanakana.isKana(text)) {
            console.log("Searching in second")
            const ent_ids = await searchByReadingElement(text,db);
            results = await fetchEntryDetails(ent_ids,db);
          } else if (wanakana.isJapanese(text) && !wanakana.isKana(text)) {
            console.log("Searching in third")
            const ent_ids = await serachByKanjiElement(text,db)
            results = await fetchEntryDetails(ent_ids,db);
          } else if (wanakana.isJapanese(wanakana.toHiragana(text))) {
            console.log("Searching in fourth")
            const ent_ids = await searchByReadingElement(wanakana.toHiragana(text),db); 
            results = await fetchEntryDetails(ent_ids,db);
          }
          
          const endTime = performance.now();
          console.log(`Search completed in ${(endTime - startTime).toFixed(2)} ms, for word '${text}'`);
          const rawResults = Array.isArray(results) ? results : [];
          const sortedResults = sortResultsByClosestGlossMatch(rawResults, text);
          setSearchResults(sortedResults);
         
        } catch(error) {
          console.error('Error searching: ', error);
          Alert.alert('error', 'Failed to search, try again.');
          setSearchResults([]);
        };
    }, 500), // 500 debounce, so function recreates every?
  );
  // Assigns a score to the gloss terms based on how close they are to the search term
  const scoreGloss = (gloss,searchWord) => {
    let highScore = -1;
    const lowerCaseSearchWord = searchWord.toLowerCase();
    gloss.forEach(term => {
      const lowerCaseTerm = term.toLowerCase();
      if(lowerCaseSearchWord === lowerCaseTerm) {
        highScore = Infinity;
        return;
      }

      if(lowerCaseTerm.includes(lowerCaseSearchWord)) {
        const score = lowerCaseTerm.length / lowerCaseSearchWord.length;
        if(score > highScore) highScore = score;
      }
    })
    return highScore;
  }

  const scoreGlossByReadingEle = (reading_elements,searchWord) => {
    console.log(searchWord);
    let highScore = -1;
    reading_elements.forEach(term => {
      if(searchWord === term) {
        highScore = Infinity;
        return;
      }

      if(term.includes(searchWord)) {
        const score = term.length / searchWord.length;
        if(score > highScore) highScore = score;
      }
    })
    return highScore;
  }

  // Sorts gloss results
  const sortResultsByClosestGlossMatch = (results, searchTerm) => {
    if (!searchTerm || !results.length) return results;
    
    if(!wanakana.isJapanese(wanakana.toKana(searchTerm)) && !wanakana.isJapanese(searchTerm)) {
    return [...results].sort((a, b) => {
      console.log("Calculating in first");
      // Extract all glosses from senses (flattened)
      const glossesA = a.senses.flatMap(sense => sense.gloss || []);
      const glossesB = b.senses.flatMap(sense => sense.gloss || []);
      
  
      // Calculate scores
      const scoreA = scoreGloss(glossesA, searchTerm);
      const scoreB = scoreGloss(glossesB, searchTerm);
  
      // Higher score = closer match = comes first
      return scoreB - scoreA;
    });
    } else {
      return [...results].sort((a, b) => {
        console.log("Calculating in second");
        // Extract all glosses from senses (flattened)
        
        const rInfoA = a.reading_elements.flatMap(rInfo => rInfo.word_reading || []);
        const rInfoB = b.reading_elements.flatMap(rInfo => rInfo.word_reading || []);
        
    
        // Calculate scores

        const scoreA = scoreGlossByReadingEle(rInfoA, wanakana.toHiragana(searchTerm));
        const scoreB = scoreGlossByReadingEle(rInfoB, wanakana.toHiragana(searchTerm));
       // console.log("Word is: ", searchTerm, "Score A is: ", scoreA, " Score B is: ", scoreB);
        // Higher score = closer match = comes first
        return scoreB - scoreA;
      });
    }
  };
  
  const handleInputChange = (text) => {
    if(text === '') {
      setSearchResults([]);
    } else {
      setSearchText(text);
      debouncedSearch(text);
    }
  };

  const handleClear = () => {
    setSearchText('');
    setSearchResults([]);
  }

    return (
        <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
          <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#444' : '#ccc', width: '100%' }} />
          <View style={styles.container}>
            {/*Display search bar*/}
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.input, { color: theme === "dark" ? '#fff' : "#000" }]}
                placeholder='Search'
                placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.7)'}
                value={searchText}
                autoCorrect={false}
                onChangeText={handleInputChange} // Uses the debounce handler
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>X</Text>
                </TouchableOpacity>
              )}
            </View>
            {/*Displays search results via a series of calls*/}
            <ScrollView style={styles.scrollView}
            contentContainerStyle={{paddingBottom: 16}}
            showsVerticalScrollIndicator={false}>
              {searchResults.map((word,index) => (
                <WordSearchDisplayCard 
                  key={index}
                  kanji_elements={word.kanji_elements}
                  reading_elements={word.reading_elements}
                  senses={word.senses}
                />
              ))}
            </ScrollView>
          </View>
        </GestureHandlerRootView>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      padding: 16,
    },
    searchContainer: {
      width: '100%',
      marginBottom: 16,
      backgroundColor: theme === "dark" ? '#3d3e3b' : "#ffffff",
    },
    input: {
      height: 40,
      width: '100%',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
    },
    scrollView: {
      flex: 1,
      width: '100%',
    },
    button: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    clearButton: {
      position: 'absolute', 
      right: 10, 
      top: 8, 
      backgroundColor: '#ccc',
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    clearButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
});
  
  export default WordSearchBar;