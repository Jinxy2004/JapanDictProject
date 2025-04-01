import { View, useColorScheme, StyleSheet, ActivityIndicator, Image, Button} from 'react-native';
import { useState, useEffect } from 'react';
import TextRecognition, {
  TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
const wanakana = require('wanakana');


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
        console.log(wanakana.tokenize(block.text));
      }
    
      setRecognizedText(resultArray);
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
      <ScrollView>
        <Button title="Open Image" onPress={openImagePicker}/>
        {selectedImage && (
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.imagePreview} 
            resizeMode="contain"
          />
        )}
        <ThemedText style={styles.title}>Recognized Japanese Text:</ThemedText>
        <ThemedText style={styles.textOutput}>
          {recognizedText.join('\n') || 'No text recognized'}
        </ThemedText>
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
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  textOutput: {
    marginTop: 10,
    padding: 15,
    color: '#333',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '90%',
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});

