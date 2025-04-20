import Modal from 'react-native-modal';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchModalData, searchBySingularReadingElement, serachBySingularKanjiElement, fetchEntryDetails } from "@/util/searchWordDictionary";
import { useState, useEffect } from 'react';
const wanakana = require('wanakana');
import { ThemedText } from '../ThemedText';
import { useTheme } from "../ThemeContext";
import { useRouter } from 'expo-router';

const OcrModal = ({ isVisible, onClose, word, db }) => {
    const [wordData, setWordData] = useState(null);
    const{theme} = useTheme();
    const [isLoading,setIsLoading] = useState(null);
    const router = useRouter();
    const [allWordResults, setAllWordResults] = useState([])

    // Handles grabbing all word information
    useEffect(() => {
        if(!isVisible) {
            setWordData(null);
            setAllWordResults([]);
            return;
        }

        let isMounted = true;

        if (!word) return;
        async function fetchWordInfo() {
            try {
                let ent_ids = []
                if(wanakana.isKana(word)) {
                    ent_ids = await searchBySingularReadingElement(word, db);
                } else {
                    ent_ids = await serachBySingularKanjiElement(word, db)
                }
                
                if (ent_ids && isMounted) {
                    const modalData = await fetchModalData(ent_ids.ent_seq, db);
                    setWordData(modalData);
                    setIsLoading(true);
                    const wordDetails = await fetchEntryDetails([ent_ids.ent_seq],db);
                    setAllWordResults(wordDetails);
                    setIsLoading(false);
                } else if (isMounted) {
                    setWordData(null);
                }
            } catch (error) {
                console.error('Error fetching word info:', error);
            }
        }
        fetchWordInfo();
        return () => {
            isMounted = false;
        }
    }, [word, db, isVisible]);

    // Maps word information pushes it to a word page and closes modal
    function handlePress() {
        if(allWordResults) {
            try {
                let safeKanji;
                let safeReadings;
                let safeSenses;
            allWordResults.map((word) => {
                 safeKanji = Array.isArray(word.kanji_elements) ? word.kanji_elements : [];
                 safeReadings = Array.isArray(word.reading_elements) ? word.reading_elements : [];
                 safeSenses = Array.isArray(word.senses) ? word.senses : [];
            })
            router.push({
                pathname: "/words/wordInfoDisplay",
                params: {
                  kanji_elements: JSON.stringify(safeKanji),
                  reading_elements: JSON.stringify(safeReadings),
                  senses: JSON.stringify(safeSenses)
                }
              })
            onClose();
            } catch(error) {
                console.error("Error pushing word: ",error);
            }
        }
    }


    const styles = StyleSheet.create({
        modalContent: {
            backgroundColor: theme === "dark" ? '#3d3e3b' : "#ffffff",
            padding: 20,
            borderRadius: 10,
        },
        wordText: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
        }
    });

    return (
        <Modal 
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
        >
            <View style={styles.modalContent}>
                <ThemedText style={styles.wordText}>{word}</ThemedText>
                {wordData ? (
                    <View>
                        <ThemedText>Kanji: {wordData.keb.join(', ')}</ThemedText>
                        <ThemedText>Reading: {wordData.reb.join(', ')}</ThemedText>
                        <ThemedText>Meaning: {wordData.gloss.join(', ')}</ThemedText>
                        {isLoading && (
                            <ThemedText type="link">
                                Loading...
                            </ThemedText>
                        )}
                        {!isLoading && (
                             <TouchableOpacity onPress={handlePress}>
                             <ThemedText type="link">Word Page</ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <View>
                        <ThemedText>Word not found.</ThemedText>
                    </View>
                )}
            </View>
        </Modal>
    );
};

export default OcrModal;