import { Text, type TextProps, StyleSheet } from "react-native";
import { useTheme } from "@/components/ThemeContext";
import * as Font from "expo-font";
import { useEffect, useState } from "react";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "BigTitle";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { theme, font } = useTheme();
  const isDark = theme === "dark";
  const color = isDark ? darkColor || "#ffffff" : lightColor || "#000000";
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      try {
        await Font.loadAsync({
          "KleeOne-Regular": require("../assets/fonts/KleeOne-Regular.ttf"),
          "MochiyPopOne-Regular": require("../assets/fonts/MochiyPopOne-Regular.ttf"),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    }
    loadFont();
  }, []);

  const getFontFamily = () => {
    if (!fontLoaded) return undefined;
    return font || "System";
  };

  return (
    <Text
      style={[
        { color },
        { fontFamily: getFontFamily() },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "BigTitle" ? styles.bigTitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 18,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  bigTitle: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
