import React, { createContext, useState, useContext, useEffect } from "react";
import { Appearance } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || "light");
  const [font, setFont] = useState('System');
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (!isManual) {
        setTheme(colorScheme || "light");
      }
    });
    return () => subscription.remove();
  }, [isManual]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    setIsManual(true); // user overrode system preference
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, font, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
