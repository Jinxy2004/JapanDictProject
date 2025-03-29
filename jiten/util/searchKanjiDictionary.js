//const readline = require('readline');
const wanakana = require('wanakana');

// intitializeDatabase();
// Just a test function
export function checkDB(db) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `
        SELECT * FROM sqlite_master;
      `;

      const rows = await db.getAllAsync(query, []);
      resolve(rows);
    } catch (err) {
      console.error('Erorr message in searchByMeaning: ', err);
      reject(err);
    }

  });
}
// Allows user to search via kanji
export function searchByKanji(userInput, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `
      SELECT kanji.id 
      FROM kanji
      WHERE
        kanji.k_literal LIKE ?
      GROUP BY kanji.id
      `;

      const params = [
        userInput
      ];

      const rows = await db.getAllAsync(query, params);
      const kanjiIds = rows.map(row => row.id); // Extracts all the ID's from the queries
      resolve(kanjiIds);
    } catch (err) {
      console.error('Error message in searchByKanji: ', err)
      reject(err)
    }
  });
};

export function searchByMeaning(userInput, db) {
  return new Promise(async (resolve, reject) => {
    try {
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
          kanji_meanings.meaning LIKE ? 
        GROUP BY kanji.id
        ORDER BY kanji.id
      `;

      const params = [
        userInput, // Exact match
        `% ${userInput} %`, // Word surrounded by spaces
        `% ${userInput}-%`, // Word with trailing hyphen
        `%-${userInput} %`, // Word with leading hyphen
        `%(${userInput})%`, // Word with trailing parenthesis
        `%(${userInput} %`, // Word with leading parenthesis
      ];
      //console.log("Querying in meaning");
      const rows = await db.getAllAsync(query, params);
      const kanjiIds = rows.map(row => row.id); // Extracts all the ID's from the queries
      resolve(kanjiIds);
    } catch (err) {
      console.error('Erorr message in searchByMeaning: ', err);
      reject(err);
    }
  });
}


// Allows the user to search by the ony or kun reading and returns the 
export function searchByReading(userInput, db) {
  return new Promise(async (resolve, reject) => {
    try {
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
      `;
      //console.log("Querying in reading");
      const params = [
        `${wanakana.toKatakana(userInput)}%`,
        wanakana.toKatakana(userInput),
        `${userInput}%`,
        userInput,
      ];
      const rows = await db.getAllAsync(query, params);
      const kanjiIds = rows.map(row => row.id); // Extracts all the ID's from the queries
      resolve(kanjiIds);
    } catch (err) {
      console.error('Erorr message in searchByMeaning: ', err);
      reject(err);
    }

  });
}

/* 
Takes in an array of kanjiIDs for searching, and then transforms it into a CSV string
Grabs all necessary data as a JSON object for the query and nulls out values that don't exist.
It then goes through each element in the results array and converts it from a JSON string to a JS object and then returns it
Wraps everything in a promise to represent the completion or failure of the async operation
*/
export function returnKanjiDetailsByID(kanjiIDs, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const idList = kanjiIDs.join(',');

      const query = `
        SELECT json_object(
          'kanji_id', kanji.id,
          'k_literal', kanji.k_literal,
          'unicode_value', kanji.unicode_value,
          'radical_num', kanji.radical_num,
          'grade_learned', NULLIF(kanji.grade_learned,''),
          'stroke_count', kanji.stroke_count,
          'app_frequency', NULLIF(kanji.app_frequency, ''),
          'rad_name',  NULLIF(kanji.rad_name, ''),
          'JLPT_level', NULLIF(kanji.JLPT_level, ''),
          'kanji_meanings', COALESCE(json_group_array(DISTINCT NULLIF(kanji_meanings.meaning,'')),'[]'), 
          'ony_readings', COALESCE(json_group_array(DISTINCT NULLIF(kanji_on_readings.on_reading,'')),'[]'),
          'kun_readings', COALESCE(json_group_array(DISTINCT NULLIF(kanji_kun_readings.kun_reading,'')),'[]'),
          'dict_references', COALESCE(json_group_array(
          DISTINCT json_object('type',dict_references.dic_type, 'value', dict_references.dic_value)),'[]')
        ) AS json_result 
        FROM kanji
        LEFT JOIN kanji_on_readings ON kanji.id = kanji_on_readings.kanji_id
        LEFT JOIN kanji_kun_readings ON kanji.id = kanji_kun_readings.kanji_id
        LEFT JOIN kanji_meanings ON kanji.id = kanji_meanings.kanji_id
        LEFT JOIN dict_references ON kanji.id = dict_references.kanji_id
        WHERE kanji.id IN (${idList})
        GROUP BY kanji.id
        LIMIT 50;
      `;

      //console.log("Querying in return details ");
      // The coalesce in the query insures an empty array will be returned instead of null
      // Queries everything, makes sure that something was found and also parses the results into a JS Object and then returns it
      const rows = await db.getAllAsync(query, []);
      if (rows.length === 0) {
        resolve(null);
      } else {
        const kanjiDetails = rows.map(row => JSON.parse(row.json_result));
        resolve(kanjiDetails);
      }
    } catch (err) {
      console.error('Error in returnKanjiDetailsByID:', err);
      reject(err);
    }
  });
}

//Testing purposes
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Async function to make handling promises easier
// async function displayKanjiDetailsByID(userInput) {
//   try {
//     // The awaits pause each execution so that the query has time to finish before the rest of the code runs
//     const kanjiIDs = await searchByMeaning(userInput)
//     const kanjiDetails = await returnKanjiDetailsByID(kanjiIDs);
//     if (kanjiDetails) {
//       console.log(JSON.stringify(kanjiDetails, null, 2));
//     } else {
//       console.log('No details found for this kanji');
//     }
//   } catch (err) {
//     console.error('Error fetching details:', err.message);
//   }
// }

// rl.question('Enter something to search: ', (userInput) => {
//   //searchMeaning(word);
//   //searchReading(word);
//   displayKanjiDetailsByID(userInput)
//   rl.close();
// })



