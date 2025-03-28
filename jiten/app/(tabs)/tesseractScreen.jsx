import { View, useColorScheme, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useState, useEffect } from 'react';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { ThemedText } from '@/components/ThemedText';

export default function Tab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [recognizedText, setRecognizedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const recognizeText = async () => {
      try {
        setIsLoading(true);
        
        // For a local image in your assets
        const imageSource = require('../../assets/images/textToReco.png');
        const imageUri = Image.resolveAssetSource(imageSource).uri;
        
        // For an image from device storage:
        // const imageUri = 'file:///path/to/your/image.jpg';
        
        const result = await TextRecognition.recognize(imageUri);
        setRecognizedText(result.text);
      } catch (err) {
        console.error('Recognition error:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    recognizeText();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
        <ActivityIndicator size="large" />
        <ThemedText>Processing Japanese text...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
        <ThemedText>Error:</ThemedText>
        <ThemedText>{error.message}</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
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
});