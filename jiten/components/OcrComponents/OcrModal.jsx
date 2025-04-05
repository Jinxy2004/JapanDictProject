import Modal from 'react-native-modal';
import { View, StyleSheet } from 'react-native';
import { fetchModalData, searchBySingularReadingElement, serachBySingularKanjiElement } from "@/util/searchWordDictionary";
import { useState, useEffect } from 'react';
const wanakana = require('wanakana');
import { ThemedText } from '../ThemedText';
import { useTheme } from "../ThemeContext";

const OcrModal = ({ isVisible, onClose, word, db }) => {
    const [wordData, setWordData] = useState(null);
    const{theme, toggleTheme} = useTheme();

    useEffect(() => {
        async function fetchWordInfo() {
            if (!word) return;
            try {
                let ent_ids = '';
                if(wanakana.isKana(word)) {
                    ent_ids = await searchBySingularReadingElement(word, db);
                } else {
                    ent_ids = await serachBySingularKanjiElement(word, db)
                }
                
                
                if (ent_ids && ent_ids.length > 0) {
                    const modalData = await fetchModalData(ent_ids[0].ent_seq, db);
                    setWordData(modalData);
                } else {
                    setWordData(null);
                }
            } catch (error) {
                console.error('Error fetching word info:', error);
            }
        }

        fetchWordInfo();
    }, [word, db]);

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