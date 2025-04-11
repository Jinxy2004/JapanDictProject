import { Stack } from "expo-router/stack";
import { View, useColorScheme } from "react-native";
import { ThemeProvider } from "../components/ThemeContext";
import { SQLiteProvider } from "expo-sqlite";

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemeProvider>
      <SQLiteProvider
        databaseName="entireDict.db"
        assetSource={{
          assetId: require("../assets/database/entireDict.db"),
        }}
      >
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
      </SQLiteProvider>
    </ThemeProvider>
  );
}
