// Import the sqlite3 package
const sqlite3 = require('sqlite3').verbose();
const { resolve } = require('path');
const readline = require('readline');
const wanakana = require('wanakana');
const db = new sqlite3.Database("testDatabases/test_total.db");


function searchByMeaning(userInput) {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT kanji.id
    FROM kanji
    JOIN kanji_meanings ON kanji.id = kanji_meanings.kanji_id
    WHERE 
      kanji_meanings.meaning LIKE ? OR 
      kanji_meanings.meaning LIKE ? OR 
      kanji_meanings.meaning LIKE ? OR 
      kanji_meanings.meaning LIKE ? OR
      kanji_meanings.meaning LIKE ? OR
      kanji_meanings.meaning LIKE ? OR 
      kanji_meanings.meaning LIKE ? 
    GROUP BY kanji.id
    ORDER BY kanji.id
    LIMIT 10; 
  `;

    const params = [
      userInput, // Exact match
      `% ${userInput} %`, // Word surrounded by spaces
      `% ${userInput}-%`, // Word with trailing hyphen
      `%-${userInput} %`, // Word with leading hyphen
      `%(${userInput})%`, // Word with trailing parenthesis
      `%(${userInput} %`, // Word with leading parenthesis
    ];

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const kanjiIds = rows.map(row => row.id);
        resolve(kanjiIds);
      }
    });
  });
}

// Allows the user to search by the ony or kun reading and returns the 
function searchByReading(userInput) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT kanji.id FROM kanji
      LEFT JOIN kanji_on_readings ON kanji.id = kanji_on_readings.kanji_id
      LEFT JOIN kanji_kun_readings ON kanji.id = kanji_kun_readings.kanji_id
      LEFT JOIN kanji_meanings ON kanji.id = kanji_meanings.kanji_id
      WHERE 
        kanji.id IN (
          SELECT kanji_id FROM kanji_on_readings WHERE
          REPLACE(on_reading, '.', '') LIKE ? OR REPLACE(on_reading, '.', '') = ?
        )
        OR
        kanji.id IN (
          SELECT kanji_id FROM kanji_kun_readings WHERE
          REPLACE(kun_reading, '.', '') LIKE ? OR REPLACE(kun_reading, '.', '') = ?
        )
      GROUP BY kanji.id
      ORDER BY kanji.id
      LIMIT 10;
    `;

    const params = [
      `${wanakana.toKatakana(userInput)}%`,
      wanakana.toKatakana(userInput),
      `${userInput}%`,
      userInput,
    ];

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results = rows.map(row => row.id);
        resolve(results);
      }
    });
  });
}

/* 
Takes in an array of kanjiIDs for searching, and then transforms it into a CSV string
Grabs all necessary data as a JSON object for the query and nulls out values that don't exist.
It then goes through each element in the results array and converts it from a JSON string to a JS object and then returns it
Wraps everything in a promise to represent the completion or failure of the async operation
*/
function returnKanjiDetailsByID(kanjiIDs) {
  return new Promise((resolve, reject) => {
    const idList = kanjiIDs.join(',');

    const query = `
      SELECT json_object(
        'k_literal', kanji.k_literal,
        'unicode_value', kanji.unicode_value,
        'radical_num', kanji.radical_num,
        'grade_learned', NULLIF(kanji.grade_learned,''),
        'stroke_count', kanji.stroke_count,
        'app_frequency', NULLIF(kanji.app_frequency, ''),
        'rad_name',  NULLIF(kanji.rad_name, ''),
        'JLPT_level', NULLIF(kanji.JLPT_level, ''),
        'kanji_meanings', json_group_array(DISTINCT kanji_meanings.meaning),
        'ony_readings', json_group_array(DISTINCT kanji_on_readings.on_reading),
        'kun_readings', json_group_array(DISTINCT kanji_kun_readings.kun_reading),
        'dict_references', json_group_array(
        DISTINCT json_object('type',dict_references.dic_type, 'value', dict_references.dic_value)
        )
      ) AS json_result 
      FROM kanji
      LEFT JOIN kanji_on_readings ON kanji.id = kanji_on_readings.kanji_id
      LEFT JOIN kanji_kun_readings ON kanji.id = kanji_kun_readings.kanji_id
      LEFT JOIN kanji_meanings ON kanji.id = kanji_meanings.kanji_id
      LEFT JOIN dict_references ON kanji.id = dict_references.kanji_id
      WHERE kanji.id IN (${idList})
      GROUP BY kanji.id
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows.length === 0) {
        resolve(null)
      } else {
        const kanjiDetails = rows.map(row => JSON.parse(row.json_result));
        resolve(kanjiDetails);
      }
    });

  })
}

// Testing purposes
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Async function to make handling promises easier
async function displayKanjiDetailsByID(userInput) {
  try {
    // The awaits pause each execution so that the query has time to finish before the rest of the code runs
    const kanjiIDs = await searchByMeaning(userInput)
    const kanjiDetails = await returnKanjiDetailsByID(kanjiIDs);
    if (kanjiDetails) {
      console.log(JSON.stringify(kanjiDetails, null, 2));
    } else {
      console.log('No details found for this kanji');
    }
  } catch (err) {
    console.error('Error fetching details:', err.message);
  }
}

rl.question('Enter something to search: ', (userInput) => {
  //searchMeaning(word);
  //searchReading(word);
  displayKanjiDetailsByID(userInput)
  rl.close();
})



