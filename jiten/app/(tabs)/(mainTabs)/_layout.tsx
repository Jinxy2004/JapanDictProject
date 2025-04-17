import { ThemedText } from "@/components/ThemedText";
import { DrawerToggle } from "@/components/ui/DrawerToggle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useTheme } from "@/components/ThemeContext";
import { View } from "react-native";
import { SettingsToggle } from "@/components/ui/SettingsToggle";

export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
          name="wordSearch"
          options={{
            title: "Word Search",
            headerLeft: () => <DrawerToggle />,
            headerRight: () => <SettingsToggle />,
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
          name="kanjiScreen"
          options={{
            title: "Kanji Search",
            headerLeft: () => <DrawerToggle />,
            headerRight: () => <SettingsToggle />,
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
          name="ocrScreen"
          options={{
            title: "OCR Model",
            headerLeft: () => <DrawerToggle />,
            headerRight: () => <SettingsToggle />,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="camera" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
