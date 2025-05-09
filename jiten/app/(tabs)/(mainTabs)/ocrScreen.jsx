import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import TextRecognition, {
  TextRecognitionScript,
} from "@react-native-ml-kit/text-recognition";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePicker from "react-native-image-crop-picker";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import PressableText from "@/components/OcrComponents/PressableText";
import { useTheme } from "@/components/ThemeContext";
import { useTokenizer } from "../../contexts/TokenizerContext";

export default function Tab() {
  const { theme } = useTheme();
  const [recognizedText, setRecognizedText] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const styles = getStyles(theme);

  // Use tokenizer context
  const {
    tokenizer,
    loading: tokenizerLoading,
    error: tokenizerError,
  } = useTokenizer();

  const openImagePicker = () => {
    ImagePicker.openPicker({
      multiple: false,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: "photo",
    }).then((image) => {
      setSelectedImage(image.path);

      Image.getSize(image.path, (width, height) =>
        setImageDimensions({ width, height })
      );
    });
  };

  const openImageTaker = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then((image) => {
      setSelectedImage(image.path);

      Image.getSize(image.path, (width, height) =>
        setImageDimensions({ width, height })
      );
    });
  };

  const recognizeTextFromImage = async (imageUri) => {
    try {
      setIsLoading(true);
      setError(null);

      const uri = imageUri.startsWith("file://")
        ? imageUri
        : `file://${imageUri}`;
      const result = await TextRecognition.recognize(
        uri,
        TextRecognitionScript.JAPANESE
      );
      let resultArray = [];
      for (let block of result.blocks) {
        resultArray.push(block.text);
      }

      // Cleans up text
      let joinedText = resultArray.join("");
      // First, clean up any multiple spaces
      joinedText = joinedText.replace(/\s+/g, " ");
      // Remove spaces between Japanese characters (including hiragana, katakana, and kanji)
      joinedText = joinedText.replace(
        /([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF])\s+([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF])/g,
        "$1$2"
      );
      // Replace commas with Japanese comma
      joinedText = joinedText.replace(/,/g, "、");
      // Then add spaces after punctuation
      joinedText = joinedText.replace(/[。]/g, (match) => match + " ");
      // Finally, clean up any spaces before punctuation
      joinedText = joinedText.replace(/\s+([、。])/g, "$1");

      setRecognizedText(joinedText);
    } catch (err) {
      console.error("Recognition error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (recognizedText.length > 0 && tokenizer) {
      try {
        const tokenizedResult = tokenizer.tokenize(recognizedText);
        setTokens(tokenizedResult);
      } catch (e) {
        console.error("Error tokenizing text: ", e);
      }
    }
  }, [recognizedText, tokenizer]);

  useEffect(() => {
    if (selectedImage) {
      recognizeTextFromImage(selectedImage);
    }
  }, [selectedImage]);

  if (tokenizerLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "#000000" : "#ffffff" },
        ]}
      >
        <ActivityIndicator size="large" />
        <ThemedText>Loading tokenizer...</ThemedText>
      </SafeAreaView>
    );
  }
  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "#000000" : "#ffffff" },
        ]}
      >
        <ActivityIndicator size="large" />
        <ThemedText>Processing Japanese text...</ThemedText>
      </SafeAreaView>
    );
  }

  if (error || tokenizerError) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "#000000" : "#ffffff" },
        ]}
      >
        <ThemedText>Error:</ThemedText>
        <ThemedText>{(error || tokenizerError)?.message}</ThemedText>
        <Button title="Try Again" onPress={() => setError(null)} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#000000" : "#ffffff" },
      ]}
    >
      <ScrollView style={styles.scrollView}>
        <View
          style={{
            flexDirection: "row-reverse",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Button title="Open Image" onPress={openImagePicker} />
          <Button title="Select Image" onPress={openImageTaker} />
        </View>
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={{
              width: "100%",
              height:
                ((imageDimensions.height + 100) / imageDimensions.width) * 100 +
                "%",
              borderWidth: 1,
              borderRadius: 8,
              borderColor: theme === "dark" ? "#fff" : "#000",
            }}
            resizeMode="contain"
          />
        )}
        <ThemedText style={styles.title}>Recognized Japanese Text</ThemedText>
        <View style={[styles.textContainer]}>
          <PressableText
            style={{
              backgroundColor: theme === "dark" ? "#3d3e3b" : "#ffffff",
            }}
            inputText={tokens}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      width: "100%",
    },
    title: {
      fontSize: 18,
      marginBottom: 20,
      fontWeight: "bold",
      textAlign: "center",
      width: "100%",
    },
    textContainer: {
      width: "100%",
      flex: 1,
      marginTop: 10,
      padding: 15,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? "#3d3e3b" : "#ffffff",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#fff" : "#000",
    },
    textOutput: {
      marginTop: 10,
      padding: 15,
      color: "#333",
      backgroundColor: "#f5f5f5",
      borderRadius: 8,
      width: "100%",
      flexWrap: "wrap",
      flexShrink: 1,
      textAlign: "left",
      flex: 1,
      fontSize: 16,
    },
    imagePreview: {
      width: "100%",
      aspectRatio: 1,
      marginBottom: 10,
    },
    scrollView: {
      width: "100%",
    },
  });
