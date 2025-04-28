import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { fetchEntryDetails, fetchEntryIDsViaJLPT } from './generateJSONUTIL.js';

// Run this file to add all JSONs for word lists

const sqlite = sqlite3.verbose();

const dbPath = path.join(process.cwd(), "testDB.db");
const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.log("DB path is: ", dbPath);
        console.error('Could not open database', err);
    } else {
        console.log('Connected to database');
    }
});

async function getWordDetails(JLPT_LEVEL) {
    try {
        const ent_ids = await fetchEntryIDsViaJLPT(JLPT_LEVEL, db);
        const word_info = await fetchEntryDetails(ent_ids, db);
        //console.log(word_info);
        return word_info;
    } catch (error) {
        console.error("Error getting word details: ", error);
    }
}
async function writeWordDetails(JLPT_LEVEL) {
    try {
        const wordDetails = await getWordDetails(JLPT_LEVEL)
        const filePath = path.join(process.cwd(), "..", "jiten", "assets", "word_list_jsons", "jlpt", "N" + JLPT_LEVEL + ".json");
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        fs.writeFileSync(filePath, JSON.stringify(wordDetails));
        console.log("Wrote word details: ", filePath);
    } catch (err) {
        console.error("Error writing word details: ", err);
    }
}

//console.log(JSON.stringify(getWordDetails("1")))
writeWordDetails("1");
writeWordDetails("2");
writeWordDetails("3");
writeWordDetails("4");
writeWordDetails("5");
//console.log(getWordDetails("1"));
