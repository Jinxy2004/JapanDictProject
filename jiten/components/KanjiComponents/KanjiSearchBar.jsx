import React, { useCallback, useState } from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { searchByMeaning, searchByReading, returnKanjiDetailsByID, searchByKanji } from '../../util/searchKanjiDictionary.js';
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import { useSQLiteContext } from "expo-sqlite";
import KanjiSearchDisplayCard from "./KanjiSearchDisplayCard.jsx";
const debounce = require('debounce');
const wanakana = require('wanakana');

const KanjiSearchBar = () => {
  const db = useSQLiteContext();
  // The value inside of useState is the initial value, the first value inside of the [] isr the current value and the second
  // value is a function that lets you update the current value and re-render
    const[searchText, setSearchText] = useState('') // This stores the input values
    const[searchResults, setSearchResults] = useState([]) // This stores the resulting array of searches
  
    const debouncedSearch = useCallback(
    debounce(async (text) => {
        try {
          console.log("Current input is: ",text);
          // Checks to see if the input isn't Japanese
          if(wanakana.isKanji(text)) {
            const kanjiIDs = await searchByKanji(text, db)
            results = await returnKanjiDetailsByID(kanjiIDs,db)
          } else if(!wanakana.isJapanese(text)) {
            const kanjiIDs1 = await searchByReading(text,db);
            const kanjiIds2 = await searchByMeaning(text,db);
            results = await returnKanjiDetailsByID(kanjiIDs1.concat(kanjiIds2),db);
          // Checks to see if the input is Romaji or Japanese, in which cases convert it to Hiragana and searches
          } else if (wanakana.isRomaji(text) || wanakana.isJapanese(text)) {
            wanakana.toHiragana(text);
            const kanjiIds1 = await searchByReading(text,db);
            const kanjiIds2 = await searchByMeaning(text,db)
            results = await returnKanjiDetailsByID(kanjiIds1.concat(kanjiIds2),db);
          } 
          setSearchResults(Array.isArray(results) ? results : []);

        } catch(error) {
          console.error('Error searching: ', error);
          Alert.alert('error', 'Failed to search, try again.');
          setSearchResults([]);
        };
    }, 500), // 500MS debounce, so function recreates every 500ms?
  );

  //
  const handleInputChange = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleClear = () => {
    setSearchText('');
    setSearchResults([]);
  }

    return (
        <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
          <View style={styles.container}>
            {/*Display search bar*/}
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.input, { color: '#ffffff' }]}
                placeholder='Search'
                placeholderTextColor={'rgba(255,255,255,.5)'}
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
            <ScrollView style={styles.scrollView}>
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
            </ScrollView>
          </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      padding: 16,
    },
    searchContainer: {
      width: '100%',
      marginBottom: 16,
      backgroundColor: '#1e1e1f',
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
  
  export default KanjiSearchBar;
