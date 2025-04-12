import { View, useColorScheme, StyleSheet, ActivityIndicator, Image, Button, Modal} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import TextRecognition, {
  TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import PressableText from '@/components/OcrComponents/PressableText';
import kuromoji from "@charlescoeder/react-native-kuromoji";
import { Asset } from 'expo-asset';

export default function Tab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [recognizedText, setRecognizedText] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tokenizerLoading, setTokenizerLoading] = useState(false);
  const tokenizerRef = useRef(null);

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
    const assets = {
      "base.dat.gz": Asset.fromModule(
      require("../../../assets/dict/base.dat.gz")
      ),
      "cc.dat.gz": Asset.fromModule(require("../../../assets/dict/cc.dat.gz")),
      "check.dat.gz": Asset.fromModule(
      require("../../../assets/dict/check.dat.gz")
      ),
      "tid.dat.gz": Asset.fromModule(require("../../../assets/dict/tid.dat.gz")),
      "tid_map.dat.gz": Asset.fromModule(
      require("../../../assets/dict/tid_map.dat.gz")
      ),
      "tid_pos.dat.gz": Asset.fromModule(
      require("../../../assets/dict/tid_pos.dat.gz")
      ),
      "unk.dat.gz": Asset.fromModule(require("../../../assets/dict/unk.dat.gz")),
      "unk_char.dat.gz": Asset.fromModule(
      require("../../../assets/dict/unk_char.dat.gz")
      ),
      "unk_compat.dat.gz": Asset.fromModule(
      require("../../../assets/dict/unk_compat.dat.gz")
      ),
      "unk_invoke.dat.gz": Asset.fromModule(
      require("../../../assets/dict/unk_invoke.dat.gz")
      ),
      "unk_map.dat.gz": Asset.fromModule(
      require("../../../assets/dict/unk_map.dat.gz")
      ),
      "unk_pos.dat.gz": Asset.fromModule(
      require("../../../assets/dict/unk_pos.dat.gz")
      ),
    };
    setTokenizerLoading(true);
    kuromoji.builder({ assets }).build((err, tokenizer) => {
      if (err) {
        console.error("Kuromoji initialization error:", err);
        return;
      }
      tokenizerRef.current = tokenizer; 
      setTokenizerLoading(false);
    });

    // Cleanup on unmount
    return () => {
      if (tokenizerRef.current) {
        tokenizerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (recognizedText && tokenizerRef.current) {
      const tokenizedResult = tokenizerRef.current.tokenize(recognizedText);
      setTokens(tokenizedResult);
      console.log(tokenizerRef.current.tokenize("には"))
    }
  }, [recognizedText]);

  useEffect(() => {
    if (selectedImage) {
      recognizeTextFromImage(selectedImage);
    }
  }, [selectedImage]);

  if (tokenizerLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff'}]}>
        <ActivityIndicator size="large"/>
        <ThemedText>Loading tokenizer...</ThemedText>
      </SafeAreaView>
    );
  }
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
        <ThemedText style={styles.title}>Recognized Japanese Text</ThemedText>
        <View style={[styles.textContainer, { backgroundColor: isDark ? '#3d3e3b' : '#ffffff' }]}>
        <PressableText style={{backgroundColor: isDark ? '#3d3e3b' : '#ffffff'}}inputText={tokens}/>
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
    textAlign: 'center',
    width: '100%'
  },
  textContainer: {
    width: '100%',
    flex: 1,
    marginTop: 10,
    padding: 15,
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

