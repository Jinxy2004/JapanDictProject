import { Stack } from "expo-router";

export default function TabStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="(mainTabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="kanji/kanjiInfoDisplay"
        options={{
          title: "Kanji Info",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="words/wordInfoDisplay"
        options={{
          title: "Word Info",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
