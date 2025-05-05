import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import {
  searchByReadingElement,
  searchByGloss,
  serachByKanjiElement,
  fetchEntryDetails,
  checkDB,
} from "../../util/searchWordDictionary.js";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSQLiteContext } from "expo-sqlite";
import WordSearchDisplayCard from "./WordSearchDisplayCard.jsx";
import { useTheme } from "../ThemeContext";
import { ThemedText } from "../ThemedText";
import { FlatList } from "react-native";
const debounce = require("debounce");
const wanakana = require("wanakana");

const WordSearchBar = () => {
  const db = useSQLiteContext();
  // Enable WAL mode to stop DB locks
  useEffect(() => {
    const enableWAL = async () => {
      try {
        await db.runAsync("PRAGMA journal_mode = WAL;");
        await db.runAsync("PRAGMA synchronous = NORMAL;");
      } catch (error) {
        console.error("Error enabling WAL mode:", error);
      }
    };
    enableWAL();
  }, []);

  // The value inside of useState is the initial value, the first value inside of the [] isr the current value and the second
  // value is a function that lets you update the current value and re-render
  const [searchText, setSearchText] = useState(""); // This stores the input values
  const [searchResults, setSearchResults] = useState([]); // This stores the resulting array of searches
  const [userTerms, setUserTerms] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const loadSearchList = async () => {
    try {
      const searchedTerms = await db.getAllAsync(
        "SELECT date_searched, recent_search FROM user_recent_searches",
        []
      );
      setUserTerms(searchedTerms);
    } catch (error) {
      console.error("Error loading search list: ", error);
    }
  };
  useEffect(() => {
    loadSearchList();
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (text) => {
      let results = "";
      try {
        const startTime = performance.now();
        console.log("Current input is: ", text);
        if (
          !wanakana.isJapanese(text) &&
          !wanakana.isJapanese(wanakana.toHiragana(text))
        ) {
          console.log("Searching in first");
          const ent_ids = await searchByGloss(text, db);
          results = await fetchEntryDetails(ent_ids, db);
        } else if (wanakana.isKana(text)) {
          console.log("Searching in second");
          const ent_ids = await searchByReadingElement(text, db);
          results = await fetchEntryDetails(ent_ids, db);
        } else if (wanakana.isJapanese(text) && !wanakana.isKana(text)) {
          console.log("Searching in third");
          const ent_ids = await serachByKanjiElement(text, db);
          results = await fetchEntryDetails(ent_ids, db);
        } else if (wanakana.isJapanese(wanakana.toHiragana(text))) {
          console.log("Searching in fourth");
          const ent_ids2 = await searchByGloss(text, db);
          const ent_ids = await searchByReadingElement(
            wanakana.toHiragana(text),
            db
          );
          console.log("Ent id 1: ", ent_ids);
          console.log("Ent id 2: ", ent_ids2);
          results = await fetchEntryDetails(ent_ids.concat(ent_ids2), db);
        }

        const endTime = performance.now();
        console.log(
          `Search completed in ${(endTime - startTime).toFixed(
            2
          )} ms, for word '${text}'`
        );
        const rawResults = Array.isArray(results) ? results : [];
        try {
          const sortedResults = sortResultsByClosestGlossMatch(
            rawResults,
            text
          );
          setSearchResults(sortedResults);
        } catch (error) {
          setSearchResults(rawResults);
          console.error("Error sorting words: ", error);
        }
      } catch (error) {
        console.error("Error searching: ", error);
        Alert.alert("error", "Failed to search, try again.");
        setSearchResults([]);
      }
    }, 500) // 500 debounce, so function recreates every?
  );
  // Assigns a score to the gloss terms based on how close they are to the search term
  const scoreGloss = (gloss, searchWord) => {
    let highScore = -1;
    const lowerCaseSearchWord = searchWord.toLowerCase();
    gloss.forEach((term) => {
      const lowerCaseTerm = term.toLowerCase();
      if (lowerCaseSearchWord === lowerCaseTerm) {
        highScore = Infinity;
        return;
      }

      if (lowerCaseTerm.includes(lowerCaseSearchWord)) {
        const score = lowerCaseTerm.length / lowerCaseSearchWord.length;
        if (score > highScore) highScore = score;
      }
    });
    return highScore;
  };

  const scoreGlossByReadingEle = (reading_elements, searchWord) => {
    let highScore = -1;
    reading_elements.forEach((term) => {
      if (searchWord === term) {
        highScore = Infinity;
        return;
      }

      if (term.includes(searchWord)) {
        const score = term.length / searchWord.length;
        if (score > highScore) highScore = score;
      }
    });
    return highScore;
  };

  const scoreGlossByKanjiEle = (kanji_elements, searchWord) => {
    let highScore = -1;
    kanji_elements.forEach((term) => {
      if (searchWord === term) {
        highScore = Infinity;
        return;
      }

      if (term.includes(searchWord)) {
        const score = term.length / searchWord.length;
        if (score > highScore) highScore = score;
      }
    });
    return highScore;
  };

  // Sorts gloss results
  const sortResultsByClosestGlossMatch = (results, searchTerm) => {
    if (!searchTerm || !results.length) return results;

    let isKanji = false;
    const tokenizedItems = wanakana.tokenize(searchTerm);
    tokenizedItems.forEach((curValue) => {
      if (wanakana.isKanji(curValue)) isKanji = true;
    });

    if (
      !wanakana.isJapanese(wanakana.toKana(searchTerm)) &&
      !wanakana.isJapanese(searchTerm)
    ) {
      return [...results].sort((a, b) => {
        console.log("Sorting by sense");
        // Extract all glosses from senses (flattened)
        const glossesA = a.senses.flatMap((sense) => sense.gloss || []);
        const glossesB = b.senses.flatMap((sense) => sense.gloss || []);

        // Calculate scores
        const scoreA = scoreGloss(glossesA, searchTerm);
        const scoreB = scoreGloss(glossesB, searchTerm);

        // Higher score = closer match = comes first
        return scoreB - scoreA;
      });
    } else if (!isKanji) {
      console.log("Sorting by reading ele");
      console.log(results);
      return [...results].sort((a, b) => {
        // Extract all glosses from senses (flattened)

        const rInfoA = a.reading_elements.flatMap(
          (rInfo) => rInfo.word_reading || []
        );
        const rInfoB = b.reading_elements.flatMap(
          (rInfo) => rInfo.word_reading || []
        );

        // Calculate scores

        const scoreA = scoreGlossByReadingEle(
          rInfoA,
          wanakana.toHiragana(searchTerm)
        );
        const scoreB = scoreGlossByReadingEle(
          rInfoB,
          wanakana.toHiragana(searchTerm)
        );
        // console.log("Word is: ", searchTerm, "Score A is: ", scoreA, " Score B is: ", scoreB);
        // Higher score = closer match = comes first
        return scoreB - scoreA;
      });
    } else {
      return [...results].sort((a, b) => {
        console.log("Sorting by kanji ele");
        // Extract all glosses from senses (flattened)
        const kInfoA = a.kanji_elements.flatMap(
          (kInfo) => kInfo.keb_element || []
        );
        const kInfoB = b.kanji_elements.flatMap(
          (kInfo) => kInfo.keb_element || []
        );

        // Calculate scores

        const scoreA = scoreGlossByKanjiEle(
          kInfoA,
          wanakana.toHiragana(searchTerm)
        );
        const scoreB = scoreGlossByKanjiEle(
          kInfoB,
          wanakana.toHiragana(searchTerm)
        );
        // console.log("Word is: ", searchTerm, "Score A is: ", scoreA, " Score B is: ", scoreB);
        // Higher score = closer match = comes first
        return scoreB - scoreA;
      });
    }
  };

  const handleInputChange = (text) => {
    if (text === "") {
      setSearchResults([]);
      loadSearchList();
    } else {
      setSearchText(text);
      debouncedSearch(text);
    }
  };

  const handleClear = () => {
    setSearchText("");
    loadSearchList();
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (!searchText) return;

    try {
      const timeString = formatDateTime();
      await db.runAsync("BEGIN IMMEDIATE TRANSACTION");

      await db.runAsync(
        "INSERT INTO user_recent_searches(recent_search,date_searched) VALUES (?,?)",
        [searchText, timeString]
      );

      await db.runAsync("COMMIT");
      await loadSearchList(); // Refresh the list after successful insert
    } catch (error) {
      console.error("Error inserting recent search:", error);
      await db.runAsync("ROLLBACK");
    }
  };

  const formatDateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const amORpm = hours >= 12 ? "PM" : "AM";
    const twelveHour = hours % 12 || 12;
    const minutes = now.getMinutes();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${month}/${day} ${twelveHour.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}${amORpm} `;
  };

  const onRecentPress = (searchTerm) => {
    setSearchText(searchTerm);
    debouncedSearch(searchTerm);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, width: "100%" }}>
      <View
        style={{
          height: 1,
          backgroundColor: theme === "dark" ? "#444" : "#ccc",
          width: "100%",
        }}
      />
      <View style={styles.container}>
        {/*Display search bar*/}
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.input,
              { color: theme === "dark" ? "#fff" : "#000" },
            ]}
            placeholder="Search"
            placeholderTextColor={
              theme === "dark" ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.7)"
            }
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
        {searchText !== "" && (
          <FlatList
            data={searchResults}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <WordSearchDisplayCard
                kanji_elements={item.kanji_elements}
                reading_elements={item.reading_elements}
                senses={item.senses}
              />
            )}
            initialNumToRender={20} // Adjust for performance
            maxToRenderPerBatch={20}
            windowSize={21}
          />
        )}
        {searchText === "" && (
          <ScrollView style={styles.scrollView}>
            {userTerms.map((line, index) => (
              <View key={index} style={styles.recentsContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.pressables,
                    pressed && styles.pressedItem,
                  ]}
                  onPress={() => onRecentPress(line.recent_search)}
                >
                  <ThemedText>{line.recent_search}</ThemedText>
                  <ThemedText>{line.date_searched}</ThemedText>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      padding: 16,
    },
    searchContainer: {
      width: "100%",
      marginBottom: 16,
      backgroundColor: theme === "dark" ? "#3d3e3b" : "#ffffff",
    },
    recentsContainer: {
      width: "100%",
      marginBottom: 16,
      backgroundColor: theme === "dark" ? "#3d3e3b" : "#ffffff",
      borderColor: "#ccc",
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
      backgroundColor:
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
      transform: [{ scale: 0.98 }],
    },
    input: {
      height: 40,
      width: "100%",
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
    },
    scrollView: {
      flex: 1,
      width: "100%",
    },
    button: {
      backgroundColor: "#007BFF",
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
    clearButton: {
      position: "absolute",
      right: 10,
      top: 8,
      backgroundColor: "#ccc",
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    clearButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });

export default WordSearchBar;
