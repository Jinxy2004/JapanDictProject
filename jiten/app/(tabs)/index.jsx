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
  touchableWrapper: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 6
  },
  touchables: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme === 'dark' ? '#3d3e3b' : '#fff',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme === 'dark' ? 'rgba(220, 220, 220, 1)' : 'rgba(0,0,0,1)',
  }

});