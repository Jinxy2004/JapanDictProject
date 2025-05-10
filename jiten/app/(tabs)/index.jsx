import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { DrawerToggle } from "@/components/ui/DrawerToggle";
import { useRouter } from "expo-router";
import { SettingsToggle } from "@/components/ui/SettingsToggle";

export default function RootLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigation = useNavigation();
  const router = useRouter();
  const styles = getStyles(theme);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: theme === "dark" ? "#fff" : "#000",
      title: "Home Page",
      headerStyle: {
        backgroundColor: theme === "dark" ? "#000" : "#fff",
      },
      headerLeft: () => <DrawerToggle />,
      headerRight: () => <SettingsToggle />,
    });
  }, [navigation, theme]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#ffffff" },
      ]}
    >
      <View
        style={{
          height: 1,
          backgroundColor: theme === "dark" ? "#444" : "#ccc",
          width: "100%",
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.aboutUs}>
          <View style={{ paddingBottom: 6 }}>
            <ThemedText type="title">App info</ThemedText>
          </View>
          <ThemedText style={styles.aboutText}>
            This is a Japanese dictionary app with OCR, and each of the three
            buttons below will lead you to their respective pages.
          </ThemedText>
        </View>
        <View style={styles.mainItems}>
          <View style={styles.touchableWrapper}>
            <TouchableOpacity
              style={styles.touchables}
              onPress={() => router.push("/(tabs)/(mainTabs)")}
            >
              <ThemedText type="title">Words</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.touchableWrapper}>
            <TouchableOpacity
              style={styles.touchables}
              onPress={() => router.push("/(tabs)/(mainTabs)/kanjiScreen")}
            >
              <ThemedText type="title">Kanji</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.touchableWrapper}>
            <TouchableOpacity
              style={styles.touchables}
              onPress={() => router.push("/(tabs)/(mainTabs)/ocrScreen")}
            >
              <ThemedText type="title">Text Analyzer</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    mainItems: {
      width: "100%",
      alignItems: "center",
      marginTop: 20,
    },
    aboutUs: {
      width: "100%",
      alignItems: "center",
      paddingTop: 16,
      paddingHorizontal: 16,
    },
    aboutText: {
      textAlign: "justify",
      lineHeight: 20,
    },
    touchableWrapper: {
      width: "100%",
      paddingVertical: 10,
      paddingHorizontal: 6,
    },
    touchables: {
      width: "100%",
      height: 80,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#3d3e3b" : "#fff",
      borderWidth: 1,
      borderRadius: 8,
      borderColor:
        theme === "dark" ? "rgba(220, 220, 220, 1)" : "rgba(0,0,0,1)",
    },
  });
