import { View, useColorScheme, StyleSheet, ActivityIndicator, Image, Button} from 'react-native';
import { useState, useEffect } from 'react';
import TextRecognition, {
  TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import {launchImageLibrary} from 'react-native-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Tab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [recognizedText, setRecognizedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      presentationStyle: 'fullScreen',
    };

    
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
        setError(response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
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
      setRecognizedText(result.text);
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
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
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
        {recognizedText || 'No text recognized'}
      </ThemedText>
    </View>
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