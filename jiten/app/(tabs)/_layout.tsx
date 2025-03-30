import { ThemedText } from "@/components/ThemedText";
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
          tabBarIconStyle: {
            width: 50,
            height: 35,
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
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ThemedText style={{ color, fontSize: 22 }}>漢字</ThemedText>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="wordSearch"
          options={{
            title: "Word Search",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ThemedText style={{ color, fontSize: 22 }}>言葉</ThemedText>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="ocrScreen"
          options={{
            title: "OCR Model",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="camera" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
