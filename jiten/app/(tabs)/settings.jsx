import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { DrawerToggle } from "@/components/ui/DrawerToggle";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  
  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: true,
        headerTintColor: theme === "dark" ? "#fff" : "#000",
      title: "Settings",
      headerStyle: {
        backgroundColor: theme === "dark" ? "#000" : "#fff",
      },
      headerRight: () => <DrawerToggle />, 
    });
  }, [navigation, theme]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#000" : "#ffffff",
    },
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#444' : '#ccc', width: '100%' }} />
      <ScrollView style={styles.container}>
        <ThemedText>Hello from Settings!</ThemedText>
        <TouchableOpacity onPress={() => toggleTheme()}>
            <ThemedText>Dark/Light mode</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
