import { View } from "react-native";
import { ThemeProvider } from "../components/ThemeContext";
import { SQLiteProvider } from "expo-sqlite";
import { CustomDrawerContent } from "../components/ui/CustomDrawer";
import { Drawer } from "expo-router/drawer";
import { useTheme } from "@/components/ThemeContext";

export default function Layout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}

export function InnerLayout() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

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
