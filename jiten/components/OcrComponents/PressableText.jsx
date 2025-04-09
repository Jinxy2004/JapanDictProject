import { Pressable, View, Text, StyleSheet } from "react-native";
import OcrModal from "./OcrModal";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { searchBySingularReadingElement, serachBySingularKanjiElement } from "@/util/searchWordDictionary";
const wanakana = require('wanakana');

const PressableText = ({ inputText }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [processedText, setProcessedText] = useState([]); // Add state for processed text
  
  const db = useSQLiteContext();

  const handlePress = (token) => {
      setSelectedWord(token);
      setIsModalVisible(true);
  };

  useEffect(() => {
    const tokenizeList = async () => {
      const tempNewText = [];
      
      for(let i = 0; i < inputText.length; i++) {
       for(let j = 5; j > 0; j--) {
        const wordSubstring = inputText.substring(i,i + 5 - j);
        console.log("I is ", i);
        console.log("J is, ",j);
        console.log("Word substring is: ",wordSubstring);
        
        if(wanakana.isHiragana(wordSubstring)) {
          const ent_id = await searchBySingularReadingElement(wordSubstring,db);
          console.log(ent_id);
          if(ent_id) {
            tempNewText.push(wordSubstring);
            break;
          }
        } else if (wanakana.isJapanese(wordSubstring)) {
            const ent_id = await serachBySingularKanjiElement(wordSubstring,db);
            console.log(ent_id);
            if(ent_id) {
              tempNewText.push(wordSubstring)
              break;
            }
        }
       }
      }
      console.log("Final processed text:", tempNewText);
      setProcessedText(tempNewText); // Update state with the processed text
    }
    
    tokenizeList();
  }, [inputText, db]);
    
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