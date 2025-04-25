import React, { useCallback, useState, useEffect} from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, Pressable} from 'react-native';
import { searchByMeaning, searchByReading, returnKanjiDetailsByID, searchByKanji } from '../../util/searchKanjiDictionary.js';
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import { useSQLiteContext } from "expo-sqlite";
import KanjiSearchDisplayCard from "./KanjiSearchDisplayCard.jsx";
import { useTheme } from "../ThemeContext";
import { ThemedText } from "../ThemedText";
const debounce = require('debounce');
const wanakana = require('wanakana');

const KanjiSearchBar = () => {
  const db = useSQLiteContext();
  // The value inside of useState is the initial value, the first value inside of the [] isr the current value and the second
  // value is a function that lets you update the current value and re-render
    const[searchText, setSearchText] = useState('') // This stores the input values
    const[searchResults, setSearchResults] = useState([]) // This stores the resulting array of searches
    const{theme} = useTheme();
    const[userTerms, setUserTerms] = useState([]);
    const styles = getStyles(theme);

    const loadSearchList = async () => {
      try {
      const searchedTerms = await db.getAllAsync('SELECT date_searched, recent_search FROM user_recent_kanji_searches', [])
      setUserTerms(searchedTerms);
      } catch (error) {
        console.error("Error loading search list: ", error)
      }
    }
    // Init user searches on startup
     useEffect(() => {
          loadSearchList();
        },[])

     // Enable WAL mode to stop DB locks
      useEffect(() => {
        const enableWAL = async () => {
          try {
            await db.runAsync('PRAGMA journal_mode = WAL;');
            await db.runAsync('PRAGMA synchronous = NORMAL;');
          } catch (error) {
            console.error('Error enabling WAL mode:', error);
          }
        };
        enableWAL();
      }, []);

    
  
    const debouncedSearch = useCallback(
    debounce(async (text) => {
        try {
          const startTime = performance.now()
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
          const endTime = performance.now();
          console.log(`Search completed in ${(endTime - startTime).toFixed(2)} ms, for word '${text}'`);
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

  const handleSubmit = async () => {
    if (!searchText) return;
    
    try {
      const timeString = formatDateTime();
      await db.runAsync('BEGIN IMMEDIATE TRANSACTION');
      
      await db.runAsync(
        'INSERT INTO user_recent_kanji_searches(recent_search,date_searched) VALUES (?,?)',
        [searchText, timeString]
      );
      
      await db.runAsync('COMMIT');
      await loadSearchList(); // Refresh the list after successful insert
      
    } catch (error) {
      console.error('Error inserting recent search:', error);
      await db.runAsync('ROLLBACK');
    }
  };

  const formatDateTime = () => {
    const now = new Date()
    const hours = now.getHours();
    const amORpm = hours >= 12 ? 'PM' : 'AM';
    const twelveHour = hours % 12 || 12;
    const minutes = now.getMinutes();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${month}/${day} ${twelveHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${amORpm} `;
  }

  const onRecentPress = (searchTerm) => {
    setSearchText(searchTerm)
    debouncedSearch(searchTerm)
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
                enterKeyHint="search"
                onSubmitEditing={handleSubmit}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>X</Text>
                </TouchableOpacity>
              )}
            </View>
            {/*Displays search results via a series of calls*/}
            {searchText !== '' && (
            <ScrollView style={styles.scrollView}
            contentContainerStyle={{paddingBottom: 16}}
            showsVerticalScrollIndicator={false}>
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
            )}
            {searchText === '' && (
              <ScrollView style={styles.scrollView}>
                {userTerms.map((line,index) => (  
                  <View key={index} style={styles.recentsContainer}>
                    <Pressable
                    style={({ pressed }) => [
                      styles.pressables,
                      pressed && styles.pressedItem
                    ]}
                    onPress={(() => onRecentPress(line.recent_search))}
                  >
                    <ThemedText>
                      {line.recent_search} 
                    </ThemedText>
                    <ThemedText>
                      {line.date_searched}
                    </ThemedText>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}
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
  recentsContainer: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: theme === "dark" ? '#3d3e3b' : "#ffffff",
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
  },
  pressables: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pressedItem: {
    backgroundColor: theme === "dark" 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)',
    transform: [{ scale: 0.98 }],
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
