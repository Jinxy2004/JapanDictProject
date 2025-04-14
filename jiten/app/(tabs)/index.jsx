import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { DrawerToggle } from '@/components/ui/DrawerToggle';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
        headerRight: () => <DrawerToggle />, 
      });
    }, [navigation, theme]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
      <View style={styles.settings}>
        <TouchableOpacity
        onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={32} color={isDark ? '#fff' : '#000'}/>
        </TouchableOpacity>
      </View>
      <View style={styles.mainItems}>
        <TouchableOpacity
        onPress={() => router.push("/(tabs)/(mainTabs)")}>
          <ThemedText>Words</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => router.push("/(tabs)/(mainTabs)/kanjiScreen")}>
          <ThemedText>Kanji</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => router.push("/(tabs)/(mainTabs)/ocrScreen")}>
          <ThemedText>Text Analyzer</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  settings: {
    alignItems: "flex-end",
  },
  mainItems: {
    justifyContent: "center",
    alignItems: "center"
  }
});