import React from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from "../ThemeContext";
import { ThemedText } from "../ThemedText";
import { useRouter } from 'expo-router';

// This is the card displays basic information about the searched up kanji
const KanjiSearchDisplayCard = ({
  // Takes in kanji information and sets null values as a backup incase previous case failed
  kanji,
  kanji_meanings = [],
  ony_readings = [],
  kun_readings = [],
  radical_num,
  grade_learned,
  stroke_count,
  app_frequency,
  rad_name,
  JLPT_level,
  dict_references = [],
}) => {
   const { theme, toggleTheme } = useTheme(); // useTheme is used to detect what mode the user is in, in order to change between a dark or light background
   const router = useRouter(); // Router to send the kanji information for the actual kanji card

   const styles = StyleSheet.create({
    card: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
        padding: 8,
        borderWidth: 1,
        borderBottomColor: '#ccc',
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

// Handles the press by pushing the kanji information to the kanjiInfoDisplay
const handleCardPress = () => {
  router.push({
    pathname: "/kanji/kanjiInfoDisplay",
    params: {
      id: kanji,
      kanji_meanings: JSON.stringify(kanji_meanings),
      ony_readings: JSON.stringify(ony_readings),
      kun_readings: JSON.stringify(kun_readings),
      radical_num,
      grade_learned,
      stroke_count,
      app_frequency,
      rad_name,
      JLPT_level,
      dict_references: JSON.stringify(dict_references),
    }
  });
}

  return (
    // Creates a touchable button around the kanji displays so on press it will go to a KanjiCard
    <TouchableOpacity onPress={handleCardPress} style={{ width: '100%' }}>
      <View style={styles.card}>
        <View style={styles.kanjiHeader}>
          <ThemedText style={styles.kanjiText}>{kanji}</ThemedText>
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.meaningText} numberOfLines={1} ellipsizeMode="clip" >{kanji_meanings.join(', ')}</ThemedText>
          <ThemedText style={styles.readingText} numberOfLines={1} ellipsizeMode="clip">{[...ony_readings, ...kun_readings].join(', ')}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default KanjiSearchDisplayCard;