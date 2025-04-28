import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet, Pressable } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { useTheme } from "@/components/ThemeContext";
import { SettingsToggle } from "@/components/ui/SettingsToggle";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";

export default function wordLists() {
    const navigation = useNavigation();
    const {theme} = useTheme();
    const styles = getStyles(theme)
    const router = useRouter();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTintColor: theme === "dark" ? "#fff" : "#000",
          title: "JLPT Levels",
          headerStyle: {
            backgroundColor: theme === "dark" ? "#000" : "#fff",
          },
          headerRight: () => <SettingsToggle />,
        });
      }, [navigation, theme]);

      function handlePress(route) {
        router.push(`/(tabs)/wordLists/JLPT_LEVELS/${route}`)
      }

    return (
    <View style={styles.container}>
     <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#444' : '#ccc', width: '100%' }} />    
        <Pressable
          style={({ pressed }) => [
            styles.pressables,
            pressed && { backgroundColor: theme === "dark" ? "#222" : "#eee" }
          ]}
          onPress={() => handlePress("N1")}
        >
          <AntDesign name="folder1" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
          <ThemedText style={{ marginLeft: 12 }}>N1</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.pressables,
            pressed && { backgroundColor: theme === "dark" ? "#222" : "#eee" }
          ]}
          onPress={() => handlePress("N2")}
        >
          <AntDesign name="folder1" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
          <ThemedText style={{ marginLeft: 12 }}>N2</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.pressables,
            pressed && { backgroundColor: theme === "dark" ? "#222" : "#eee" }
          ]}
          onPress={() => handlePress("N3")}
        >
          <AntDesign name="folder1" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
          <ThemedText style={{ marginLeft: 12 }}>N3</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.pressables,
            pressed && { backgroundColor: theme === "dark" ? "#222" : "#eee" }
          ]}
          onPress={() => handlePress("N4")}
        >
          <AntDesign name="folder1" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
          <ThemedText style={{ marginLeft: 12 }}>N4</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.pressables,
            pressed && { backgroundColor: theme === "dark" ? "#222" : "#eee" }
          ]}
          onPress={() => handlePress("N5")}
        >
          <AntDesign name="folder1" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
          <ThemedText style={{ marginLeft: 12 }}>N5</ThemedText>
        </Pressable>
    </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? "#000" : "#fff",
    },
    pressables: {
        width: "100%",
        flexDirection: "row",
        borderBottomWidth: 1,
        paddingVertical: 10,
        borderBottomColor: theme === "dark" ? "#fff" : "000",
    }
})