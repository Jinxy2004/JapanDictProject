import React, { useCallback, useState } from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { searchByReadingElement, searchByGloss, serachByKanjiElement, fetchEntryDetails, checkDB } from '../../util/searchWordDictionary.js';
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import { useSQLiteContext } from "expo-sqlite";
import KanjiSearchDisplayCard from "./WordSearchDisplayCard.jsx";
const debounce = require('debounce');
const wanakana = require('wanakana');

const WordSearchBar = () => {
  const db = useSQLiteContext();
  // The value inside of useState is the initial value, the first value inside of the [] isr the current value and the second
  // value is a function that lets you update the current value and re-render
    const[searchText, setSearchText] = useState('') // This stores the input values
    const[searchResults, setSearchResults] = useState([]) // This stores the resulting array of searches

    const debouncedSearch = useCallback(
    debounce(async (text) => {
      let results = "";
        try {
          console.log("Current input is: ",text)
          if(!wanakana.isJapanese(text)) {
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
          }

          setSearchResults(Array.isArray(results) ? results : []);
        } catch(error) {
          console.error('Error searching: ', error);
          Alert.alert('error', 'Failed to search, try again.');
          setSearchResults([]);
        };
    }, 500), // 300MS debounce, so function recreates every 300ms?
  );

  
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
              {searchResults.map((word,index) => (
                <KanjiSearchDisplayCard 
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
  
  export default WordSearchBar;