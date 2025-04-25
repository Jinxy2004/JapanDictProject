import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { useTheme } from "@/components/ThemeContext";
import { DrawerToggle } from "@/components/ui/DrawerToggle";
import { SettingsToggle } from "@/components/ui/SettingsToggle";

export default function aboutUs() {
    const navigation = useNavigation();
    const {theme} = useTheme();
    const styles = getStyles(theme)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTintColor: theme === "dark" ? "#fff" : "#000",
          title: "About Us",
          headerStyle: {
            backgroundColor: theme === "dark" ? "#000" : "#fff",
          },
          headerLeft: () => <DrawerToggle />, 
          headerRight: () => <SettingsToggle />,
        });
      }, [navigation, theme]);

    return (
    <View style={styles.container}>
     <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#444' : '#ccc', width: '100%' }} />    
     <View style={styles.aboutUs}>
          <View style={{paddingBottom: 6}}>
            <ThemedText type="title">
              About the app
            </ThemedText>
          </View>
          <ThemedText style={styles.aboutText}>
            This app is designed and developed as project for school. 
            It's purpose is to allow users to search for Japanese words/kanji using multiple forms of input,
            or use OCR to scan Japanese text from images and analyze it. 
            The word/kanji section allows you to search via Japanese input, English input, or 
            romanized Japanese input. The lists are also sorted for the closest match to show up first.
            Lastly, the text analyzer(OCR) is what allows you to scan text from images. 
            Within it you can click on the words after scanning the text and bring up a short list 
            of information about them or click to a full word page displaying info about them. Loading times
            may be slow for this as of now, and will be updated in the future.
          </ThemedText>
        </View>

    </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? "#000" : "#fff",
    },
    aboutUs: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 16,
        paddingHorizontal: 16,
      },
      aboutText: {
        textAlign: 'justify',
        lineHeight: 20,
      },
})
