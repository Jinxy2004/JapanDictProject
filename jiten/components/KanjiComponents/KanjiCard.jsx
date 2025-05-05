import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../ThemeContext";
import { ThemedText } from "../ThemedText";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { kanjiSvgs } from "./kanjiSvgs";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { SettingsToggle } from "../ui/SettingsToggle";

const KanjiCard = ({
  // takes in values and nulls out for fallback
  kanji,
  radical_num,
  grade_learned, // Can be null
  stroke_count,
  app_frequency, // Can be null
  rad_name, // Can be null
  JLPT_level, // Can be null
  kanji_meanings = [],
  ony_readings = [],
  kun_readings = [],
  dict_references = [],
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: theme === "dark" ? "#fff" : "#000",
      title: "Kanji Info",
      headerStyle: {
        backgroundColor: theme === "dark" ? "#000" : "#fff",
      },
      headerRight: () => <SettingsToggle />,
    });
  }, [navigation, theme]);

  function getKanjiFileName() {
    const codePoint = kanji.codePointAt(0);
    const hex = codePoint.toString(16).padStart(5, "0");
    return hex;
  }
  const svgComponent = kanjiSvgs[getKanjiFileName()];
  // Formats the dict references as they are objects within objects and need to be reformatted.
  const formatDictReferences = (references) => {
    return references.map((ref, index) => (
      <ThemedText key={index}>
        {ref.type}: {ref.value}
      </ThemedText>
    ));
  };

  // Helper functions
  function radNameExists() {
    return rad_name !== null && rad_name !== undefined && rad_name !== "";
  }

  function JLPTLevelExists() {
    return JLPT_level !== null && JLPT_level !== undefined && JLPT_level !== "";
  }
  function appFrequencyExists() {
    return (
      app_frequency !== null &&
      app_frequency !== undefined &&
      app_frequency !== ""
    );
  }
  function gradeLearnedExists() {
    return (
      grade_learned !== null &&
      grade_learned !== undefined &&
      grade_learned !== ""
    );
  }
  return (
    // Displays a singular kanji information
    <GestureHandlerRootView style={styles.container}>
      <View
        style={{
          height: 1,
          backgroundColor: theme === "dark" ? "#444" : "#ccc",
          width: "100%",
        }}
      />
      <View style={styles.card}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          <View style={styles.svgWrapper}>
            <ThemedText type="BigTitle">{kanji}</ThemedText>

            {svgComponent &&
              React.createElement(svgComponent, {
                width: 80,
                height: 80,
                color: theme === "dark" ? "#fff" : "#000",
              })}
          </View>
          <View style={styles.lineHeader}>
            <ThemedText type="defaultSemiBold">Main Info</ThemedText>
          </View>
          <ThemedText>Meanings: {kanji_meanings.join(", ")}</ThemedText>
          <ThemedText>Ony readings: {ony_readings.join(", ")}</ThemedText>
          <ThemedText>Kun readings: {kun_readings.join(", ")}</ThemedText>
          <View style={styles.lineHeader}>
            <ThemedText type="defaultSemiBold">Extra Info</ThemedText>
          </View>
          <ThemedText>Radical number: {radical_num}</ThemedText>
          <ThemedText>Stroke count: {stroke_count}</ThemedText>
          {/* Dynamic rendering to only show if the values exist */}
          {radNameExists() && <ThemedText>Radical name: {rad_name}</ThemedText>}
          {JLPTLevelExists() && (
            <ThemedText>JLPT level: {JLPT_level}</ThemedText>
          )}
          {appFrequencyExists() && (
            <ThemedText>Appearance frequency: {app_frequency}</ThemedText>
          )}
          {gradeLearnedExists() && (
            <ThemedText>Grade learned: {grade_learned}</ThemedText>
          )}
          <View style={styles.lineHeader}>
            <ThemedText type="defaultSemiBold">Dict References</ThemedText>
          </View>
          {formatDictReferences(dict_references)}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
    },
    card: {
      flex: 1,
      width: "100%",
      padding: 16,
      backgroundColor: theme === "dark" ? "#000" : "#fff",
    },
    scrollView: {
      width: "100%",
    },
    lineHeader: {
      flex: 1,
      width: "100%",
      height: 25,
      backgroundColor:
        theme === "dark" ? "rgba(220, 220, 220, .5)" : "rgba(0,0,0,.5)",
      borderRadius: 4,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    svgWrapper: {
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
    },
  });

export default KanjiCard;
