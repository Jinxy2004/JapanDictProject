import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000000" : "#ffffff" }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? "#ffffff" : "#000000",
          tabBarInactiveTintColor: isDark ? "#666666" : "#999999",
          tabBarStyle: {
            backgroundColor: isDark ? "#000000" : "#ffffff",
            borderTopColor: isDark ? "#333333" : "#cccccc",
          },
          headerStyle: {
            backgroundColor: isDark ? "#000000" : "#ffffff",
          },
          headerTintColor: isDark ? "#ffffff" : "#000000",
          headerTitleStyle: {
            color: isDark ? "#ffffff" : "#000000",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Kanji Search",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wordSearch"
          options={{
            title: "Word Search",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
