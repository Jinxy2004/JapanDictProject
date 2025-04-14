import { Pressable, View, StyleSheet } from "react-native";
import OcrModal from "./OcrModal";
import { useState} from "react";
import { useSQLiteContext } from "expo-sqlite";
const wanakana = require('wanakana');
import { useTheme } from "../ThemeContext";
import { ThemedText } from "../ThemedText";

const PressableText = ({ inputText }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const db = useSQLiteContext();
  const{theme, toggleTheme} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 10,
      backgroundColor: theme === "dark" ? '#3d3e3b' : "#ffffff",
      borderRadius: 8,
    },
    token: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      margin: 0,
      backgroundColor: 'transparent',
    },
    pressedToken: {
      backgroundColor: theme === "dark" ? 'rgba(136, 136, 136, 0.5)' : "rgba(0,0,0,.5)" ,
      borderRadius: 4,
    },
    tokenText: {
      fontSize: 16,
      lineHeight: 24,
    },
  });


  const handlePress = (token) => {
      setSelectedWord(token);
      setIsModalVisible(true);
  };

    const surfaceForms = inputText.map(token => token.surface_form);
    // Process the tokens to maintain proper formatting
    const processedTokens = surfaceForms.map((token, index) => {
        // Add space after period
        if (token === '。') {
            return { token, addSpace: true };
        }
        // Add space after comma
        if (token === '、') {
            return { token, addSpace: true };
        }
        return { token, addSpace: false };
    });

    return (
        <View style={styles.container}>
          {processedTokens.map(({ token, addSpace }, index) => (
            <Pressable
              key={index}
              onPress={() => handlePress(token)}
              style={({ pressed }) => [
                styles.token,
                pressed && styles.pressedToken
              ]}
            >
              <ThemedText style={styles.tokenText}>
                {token}{addSpace ? ' ' : ''}
              </ThemedText>
            </Pressable>
          ))}
          <OcrModal 
            isVisible={isModalVisible}
            onClose={() => {
              setIsModalVisible(false);
              setSelectedWord(null);
            }}
            word={selectedWord}
            db={db}
          />
        </View>
      );
    };



export default PressableText;