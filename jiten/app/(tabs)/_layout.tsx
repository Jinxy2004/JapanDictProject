import { Stack } from "expo-router";
import { useTheme } from "@/components/ThemeContext";

export default function TabStackLayout() {
  const { theme } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="(mainTabs)"
        options={{ headerShown: false, title: "Search Pages" }}
      />
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen
        name="aboutUs"
        options={{ headerShown: false, title: "About Us" }}
      />
      <Stack.Screen
        name="wordLists"
        options={{ headerShown: false, title: "Word Lists" }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerShown: false, title: "Settings" }}
      />
      <Stack.Screen
        name="kanji/kanjiInfoDisplay"
        options={{
          title: "Kanji Info",
          headerTintColor: theme === "dark" ? "#fff" : "#000",
          headerShown: true,
          headerStyle: {
            backgroundColor: theme === "dark" ? "#000" : "#fff",
          },
        }}
      />
      <Stack.Screen
        name="words/wordInfoDisplay"
        options={{
          title: "Word Info",
          headerTintColor: theme === "dark" ? "#fff" : "#000",
          headerShown: true,
          headerStyle: {
            backgroundColor: theme === "dark" ? "#000" : "#fff",
          },
        }}
      />
    </Stack>
  );
}
