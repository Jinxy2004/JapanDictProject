import { Stack } from "expo-router/stack";
import { View, useColorScheme } from "react-native";
import { ThemeProvider } from "../components/ThemeContext";

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemeProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? "#000000" : "#ffffff",
        }}
      >
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? "#000000" : "#ffffff",
            },
            headerTintColor: isDark ? "#ffffff" : "#000000",
            headerTitleStyle: {
              color: isDark ? "#ffffff" : "#000000",
            },
            contentStyle: {
              backgroundColor: isDark ? "#000000" : "#ffffff",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
