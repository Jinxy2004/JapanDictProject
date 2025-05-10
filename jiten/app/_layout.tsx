import { View, ActivityIndicator, Text } from "react-native";
import { ThemeProvider } from "../components/ThemeContext";
import { SQLiteProvider } from "expo-sqlite";
import { CustomDrawerContent } from "../components/ui/CustomDrawer";
import { Drawer } from "expo-router/drawer";
import { useTheme } from "@/components/ThemeContext";
import { TokenizerProvider, useTokenizer } from "@/contexts/TokenizerContext";

export default function Layout() {
  return (
    <TokenizerProvider>
      <ThemeProvider>
        <InnerLayout />
      </ThemeProvider>
    </TokenizerProvider>
  );
}

export function InnerLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { loading, error } = useTokenizer();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDark ? "#000" : "#fff",
        }}
      >
        <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"} />
        <Text style={{ color: isDark ? "#fff" : "#000", marginTop: 16 }}>
          Loading tokenizer...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDark ? "#000" : "#fff",
        }}
      >
        <Text style={{ color: "red", marginBottom: 8 }}>
          Error loading tokenizer
        </Text>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>
          {error.message || String(error)}
        </Text>
      </View>
    );
  }

  return (
    <SQLiteProvider
      databaseName="entireDict.db"
      assetSource={{
        assetId: require("../assets/database/entireDict.db"),
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? "#000000" : "#ffffff",
        }}
      >
        <Drawer
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? "#000" : "#fff",
            },
            headerTintColor: isDark ? "#fff" : "#000",
            drawerStyle: {
              backgroundColor: isDark ? "#000" : "#fff",
              width: "75%",
            },
            drawerLabelStyle: {
              color: isDark ? "#fff" : "#000",
            },
            headerShown: false,
            drawerType: "front",
            drawerPosition: "left",
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        />
      </View>
    </SQLiteProvider>
  );
}
