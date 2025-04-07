import { View, useColorScheme, StyleSheet, ActivityIndicator, Image, Button, Modal} from 'react-native';
import { useState, useEffect } from 'react';
import TextRecognition, {
  TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
const wanakana = require('wanakana');
import PressableText from '@/components/OcrComponents/PressableText';
import { SQLiteProvider } from 'expo-sqlite';


export default function Tab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [recognizedText, setRecognizedText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImagePicker = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      multiple: false,
      cropping: false,
      mediaType: 'photo',
      compressImageQuality: 0.8,
    }).then(image => {
      setSelectedImage(image.sourceURL);
    });
  };

  
  const recognizeTextFromImage = async (imageUri) => {
    try {
      setIsLoading(true);
      setError(null);
  
      const result = await TextRecognition.recognize(
        imageUri,
        TextRecognitionScript.JAPANESE
      );
      let resultArray = [];
      for(let block of result.blocks) {
        resultArray.push(block.text);
      }

      // Cleans up text 
      let joinedText = resultArray.join('');
      // First, clean up any multiple spaces
      joinedText = joinedText.replace(/\s+/g, ' ');
      // Remove spaces between Japanese characters (including hiragana, katakana, and kanji)
      joinedText = joinedText.replace(/([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF])\s+([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF])/g, '$1$2');
      // Replace commas with Japanese comma
      joinedText = joinedText.replace(/,/g, '、');
      // Then add spaces after punctuation
      joinedText = joinedText.replace(/[。]/g, match => match + ' ');
      // Finally, clean up any spaces before punctuation
      joinedText = joinedText.replace(/\s+([、。])/g, '$1');
      
      setRecognizedText(joinedText);
    } catch (err) {
      console.error('Recognition error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      recognizeTextFromImage(selectedImage);
    }
  }, [selectedImage]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
        <ActivityIndicator size="large" />
        <ThemedText>Processing Japanese text...</ThemedText>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
        <ThemedText>Error:</ThemedText>
        <ThemedText>{error.message}</ThemedText>
        <Button title="Try Again" onPress={() => setError(null)} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
      <ScrollView style={styles.scrollView}>
        <Button title="Open Image" onPress={openImagePicker}/>
        {selectedImage && (
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.imagePreview} 
            resizeMode="contain"
          />
        )}
        <ThemedText style={styles.title}>Recognized Japanese Text:</ThemedText>
        <View style={styles.textContainer}>
        <SQLiteProvider databaseName='entireDict.db' assetSource={{ assetId: require('../../assets/database/entireDict.db')}}>
        <PressableText inputText={recognizedText}/>
        </SQLiteProvider>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  textContainer: {
    width: '100%',
    flex: 1,
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  textOutput: {
    marginTop: 10,
    padding: 15,
    color: '#333',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%',
    flexWrap: 'wrap',
    flexShrink: 1,
    textAlign: 'left',
    flex: 1,
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
  },
});

