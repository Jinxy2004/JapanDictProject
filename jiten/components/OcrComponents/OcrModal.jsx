import Modal from 'react-native-modal';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchModalData, searchBySingularReadingElement, serachBySingularKanjiElement } from "@/util/searchWordDictionary";
import { useState, useEffect } from 'react';
const wanakana = require('wanakana');
import { ThemedText } from '../ThemedText';
import { useTheme } from "../ThemeContext";
import { useRouter } from 'expo-router';

const OcrModal = ({ isVisible, onClose, word, db }) => {
    const [wordData, setWordData] = useState(null);
    const [entID, setEntID] = useState(null);
    const{theme, toggleTheme} = useTheme();
    const router = useRouter();

    useEffect(() => {
        async function fetchWordInfo() {
            if (!word) return;
            try {
                let ent_ids = []
                if(wanakana.isKana(word)) {
                    ent_ids = await searchBySingularReadingElement(word, db);
                } else {
                    ent_ids = await serachBySingularKanjiElement(word, db)
                }
                
                if (ent_ids) {
                    setEntID(ent_ids);
                    const modalData = await fetchModalData(ent_ids.ent_seq, db);
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

    async function getAllWordData() {

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
                        <TouchableOpacity onPress={
                            console.log()
                        }>
                            <ThemedText type="link">Word Page</ThemedText>
                        </TouchableOpacity>
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