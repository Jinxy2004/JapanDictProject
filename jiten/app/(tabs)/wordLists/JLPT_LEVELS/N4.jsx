import { View, StyleSheet, Pressable } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { useTheme } from "@/components/ThemeContext";
import { SettingsToggle } from "@/components/ui/SettingsToggle";
import n4Data from "@/assets/word_list_jsons/jlpt/N4.json";
import WordSearchDisplayCard from "@/components/WordComponents/WordSearchDisplayCard";
import { FlatList } from "react-native";

export default function wordLists() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: theme === "dark" ? "#fff" : "#000",
      title: "N4",
      headerStyle: {
        backgroundColor: theme === "dark" ? "#000" : "#fff",
      },
      headerRight: () => <SettingsToggle />,
    });
  }, [navigation, theme]);

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 1,
          backgroundColor: theme === "dark" ? "#444" : "#ccc",
          width: "100%",
        }}
      />
      <FlatList
        data={n4Data}
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
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#000" : "#fff",
    },
  });
