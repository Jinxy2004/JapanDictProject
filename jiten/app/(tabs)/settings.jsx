import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { DrawerToggle } from "@/components/ui/DrawerToggle";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const styles = getStyles(theme);
  
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#444' : '#ccc', width: '100%' }} />
      <ScrollView>
        <View style={styles.lineHeader}>
            <ThemedText type="defaultSemiBold">UI Toggles</ThemedText>
        </View>
        <TouchableOpacity onPress={() => toggleTheme()}
          style={styles.touchables}>
            <ThemedText>• </ThemedText>
        <MaterialCommunityIcons name="theme-light-dark" size={24} color={theme ==="dark" ? '#fff' : "#000"} />
        </TouchableOpacity>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === "dark" ? "#000" : "#ffffff",
  },
  lineHeader: {
    width: "99%",
    height: 30,
    backgroundColor: theme === 'dark' ? 'rgba(220, 220, 220, .5)' : 'rgba(0,0,0,.5)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme === "dark" ? "#fff" : "#000",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    margin: 2,
  },
  touchables: {
    flexDirection: "row",
    paddingLeft: 5
  }
});
