import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet, Pressable } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { useTheme } from "@/components/ThemeContext";
import { SettingsToggle } from "@/components/ui/SettingsToggle";
import { useSQLiteContext } from "expo-sqlite";

export default function wordLists() {
    const navigation = useNavigation();
    const {theme} = useTheme();
    const styles = getStyles(theme);
    const db = useSQLiteContext();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTintColor: theme === "dark" ? "#fff" : "#000",
          title: "N1",
          headerStyle: {
            backgroundColor: theme === "dark" ? "#000" : "#fff",
          },
          headerRight: () => <SettingsToggle />,
        });
      }, [navigation, theme]);




    return (
    <View style={styles.container}>
     <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#444' : '#ccc', width: '100%' }} />    
        <ThemedText>Hi</ThemedText>
    </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? "#000" : "#fff",
    },
})

