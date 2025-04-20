import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { DrawerToggle } from '@/components/ui/DrawerToggle';
import { useRouter } from 'expo-router';
import { SettingsToggle } from '@/components/ui/SettingsToggle';

export default function RootLayout() {
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  const router = useRouter();
  const styles = getStyles(theme);
    
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerTintColor: theme === "dark" ? "#fff" : "#000",
        title: "Home Page",
        headerStyle: {
          backgroundColor: theme === "dark" ? "#000" : "#fff",
        },
        headerLeft: () => <DrawerToggle />,
        headerRight: () =>  <SettingsToggle/>,
      });
    }, [navigation, theme]);

  return (
    
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
      <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#444' : '#ccc', width: '100%' }} />
      <View style={styles.aboutUs}>
        <View style={{paddingBottom: 6}}>
        <ThemedText type="title">
            About the app
        </ThemedText>
        </View>
        <ThemedText>
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
      <View style={styles.mainItems}>
        <View style={styles.touchableWrapper}>
        <TouchableOpacity style={styles.touchables}
        onPress={() => router.push("/(tabs)/(mainTabs)")}>
          <ThemedText type="title">Words</ThemedText>
        </TouchableOpacity>
        </View>
        <View style={styles.touchableWrapper}>
        <TouchableOpacity style={styles.touchables}
        onPress={() => router.push("/(tabs)/(mainTabs)/kanjiScreen")}>
          <ThemedText type="title">Kanji</ThemedText>
        </TouchableOpacity>
        </View>
        <View style={styles.touchableWrapper}>
        <TouchableOpacity style={styles.touchables}
        onPress={() => router.push("/(tabs)/(mainTabs)/ocrScreen")}>
          <ThemedText type="title">Text Analyzer</ThemedText>
        </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  mainItems: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  aboutUs: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8
  },
  touchableWrapper: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 6
  },
  touchables: {
    width: "100%",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme === 'dark' ? '#3d3e3b' : '#fff',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme === 'dark' ? 'rgba(220, 220, 220, 1)' : 'rgba(0,0,0,1)',
  }

});