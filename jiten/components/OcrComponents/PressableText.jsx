import { Pressable, View, Text, StyleSheet } from "react-native";
import OcrModal from "./OcrModal";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
const wanakana = require('wanakana');

const PressableText = ({ inputText }) => {
    const [selectedWord, setSelectedWord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const db = useSQLiteContext();

    const handlePress = (token) => {
        setSelectedWord(token);
        setIsModalVisible(true);
    };

    const tokenizeList = async () => {
      
    }
    const tokenizedList = wanakana.tokenize(inputText);
    // Process the tokens to maintain proper formatting
    const processedTokens = tokenizedList.map((token, index) => {
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
              <Text style={styles.tokenText}>
                {token}{addSpace ? ' ' : ''}
              </Text>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  token: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },
  pressedToken: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  tokenText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default PressableText;