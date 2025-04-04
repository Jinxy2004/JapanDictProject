// const readline = require('readline');
// Check function
export function checkDB(db) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `
        SELECT * FROM sqlite_master;
      `;

      const rows = await db.getAllAsync(query, []);
      resolve(rows);
    } catch (err) {
      console.error('Erorr message in checkdb: ', err);
      reject(err);
    }

  });
}

// Function that returns a list of entry ids for rest of queries
export function searchByGloss(userInput, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `
        SELECT ent_seq FROM entries
        JOIN senses ON entries.ent_seq = senses.entries_id
        JOIN gloss_fts ON gloss_fts.senses_id = senses.id
        WHERE gloss_fts.word_info MATCH ?
        GROUP BY ent_seq
        LIMIT 50;
    `;

      const params = [`"${userInput}*" OR "(${userInput})"`];


      const rows = await db.getAllAsync(query, params);
      const ent_ids = rows.map(row => row.ent_seq);
      resolve(ent_ids);
    } catch (err) {
      console.error("Error in search by gloss: ", err);
      reject(err);
    }
  });
}

// Function that returns a list of entry ids for rest of queries
export function searchByReadingElement(userInput, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `
      SELECT ent_seq FROM entries
      JOIN reading_elements ON entries.ent_seq = reading_elements.entries_id
      WHERE 
        reading_elements.word_reading LIKE ? OR 
        reading_elements.word_reading LIKE ? OR 
        reading_elements.word_reading LIKE ? OR
        reading_elements.word_reading LIKE ? OR
        reading_elements.word_reading LIKE ? OR 
        reading_elements.word_reading LIKE ? OR
        reading_elements.word_reading LIKE ? 
      GROUP BY ent_seq
      LIMIT 50; 
    `;

      const params = [
        userInput, // Exact match
        `%${userInput}%`, // Anything surronding it
        `% ${userInput} %`, // Word surrounded by spaces
        `% ${userInput}-%`, // Word with trailing hyphen
        `%-${userInput} %`, // Word with leading hyphen
        `%(${userInput})%`, // Word with trailing parenthesis
        `%(${userInput} %`, // Word with leading parenthesis
      ];
      const rows = await db.getAllAsync(query, params);
      const ent_ids = rows.map(row => row.ent_seq);
      resolve(ent_ids);
    } catch (err) {
      console.error("Error in searchByReadingElement: ", err);
      reject(err);
    }
  });
}

export function serachByKanjiElement(userInput, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `
      SELECT ent_seq FROM entries
      JOIN kanji_elements ON entries.ent_seq = kanji_elements.entries_id
      WHERE 
        kanji_elements.keb_element LIKE ? OR 
        kanji_elements.keb_element LIKE ? OR 
        kanji_elements.keb_element LIKE ? OR
        kanji_elements.keb_element LIKE ? OR
        kanji_elements.keb_element LIKE ? OR 
        kanji_elements.keb_element LIKE ? OR
        kanji_elements.keb_element LIKE ? 
      GROUP BY ent_seq
      LIMIT 50; 
    `;

      const params = [
        userInput, // Exact match
        `%${userInput}%`, // Anything surronding it
        `% ${userInput} %`, // Word surrounded by spaces
        `% ${userInput}-%`, // Word with trailing hyphen
        `%-${userInput} %`, // Word with leading hyphen
        `%(${userInput})%`, // Word with trailing parenthesis
        `%(${userInput} %`, // Word with leading parenthesis
      ];
      const rows = await db.getAllAsync(query, params);
      const ent_ids = rows.map(row => row.ent_seq);
      resolve(ent_ids);
    } catch (err) {
      console.error("Error in searchByKanjiElement: ", err);
      reject(err);
    }
  });
}

// These three functions fetch all the related details based on the entry ids
/*
These three fetch queries work by first creating a base table with all the data,
The base table selects the relevant data, aggregates any data that has multiple instances
and joins the tables.
Then the data from the base table is selected and converted to JSON format and also nulled out
*/
export function fetchReadingElements(ent_seq_array, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const ent_ids = ent_seq_array.join(',');
      const query = `
        WITH reading_base AS (
          SELECT 
            re.entries_id,
            re.id,
            re.word_reading,
            re.no_kanji,
            GROUP_CONCAT(DISTINCT rr.restricted_reading) as restricted_readings,
            GROUP_CONCAT(DISTINCT rp.re_priority_info) as reading_priorities,
            GROUP_CONCAT(DISTINCT ri.specific_info) as reading_info
          FROM reading_elements re
          LEFT JOIN readings_restricted rr ON rr.reading_elements_id = re.id
          LEFT JOIN readings_priority rp ON rp.reading_elements_id = re.id
          LEFT JOIN readings_info ri ON ri.reading_elements_id = re.id
          WHERE re.entries_id IN (${ent_ids})
          GROUP BY re.id
        )
        SELECT 
          entries_id AS ent_seq,
          json_object(
            'ent_seq', entries_id,
            'id', COALESCE(id, ''),
            'word_reading', COALESCE(word_reading, ''),
            'no_kanji', COALESCE(no_kanji, ''),
            'restricted_readings', COALESCE(json_array(restricted_readings), json_array()),
            'reading_priorities', COALESCE(json_array(reading_priorities), json_array()),
            'reading_info', COALESCE(json_array(reading_info), json_array())
          ) AS reading_data
        FROM reading_base;
      `;
      const rows = await db.getAllAsync(query, []);

      if (rows.length === 0) {
        resolve(null);
      } else {
        const readingElements = rows.map(row => JSON.parse(row.reading_data));
        resolve(readingElements);
      }
    } catch (err) {
      console.log("Error occured in fetchReadingElements: ", err)
      reject(err);
    }
  });
}


export function fetchKanjiElements(ent_seq_array, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const ent_ids = ent_seq_array.join(',');
      const query = `
        WITH kanji_base AS (
          SELECT 
            ke.entries_id,
            ke.id,
            ke.keb_element,
            GROUP_CONCAT(DISTINCT ki.k_info) as kanji_info,
            GROUP_CONCAT(DISTINCT kp.k_priority_info) as kanji_priority
          FROM kanji_elements ke
          LEFT JOIN kanji_info ki ON ki.kanji_elements_id = ke.id
          LEFT JOIN kanji_priority kp ON kp.kanji_elements_id = ke.id
          WHERE ke.entries_id IN (${ent_ids})
          GROUP BY ke.id
        )
        SELECT 
          entries_id AS ent_seq,
          json_object(
            'ent_seq', entries_id,
            'id', COALESCE(id, ''),
            'keb_element', COALESCE(keb_element, ''),
            'kanji_info', COALESCE(json_array(kanji_info), json_array()),
            'kanji_priority', COALESCE(json_array(kanji_priority), json_array())
          ) AS kanji_data
        FROM kanji_base;
      `;

      const rows = await db.getAllAsync(query, []);

      if (rows.length === 0) {
        resolve(null);
      } else {
        const kanjiElements = rows.map(row => JSON.parse(row.kanji_data));
        resolve(kanjiElements);
      }
    } catch (err) {
      console.log("Error occurred in fetchKanjiElements: ", err);
      reject(err);
    }
  });
}

export function fetchSenses(ent_seq_array, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const ent_ids = ent_seq_array.join(',');
      const query = `
        WITH sense_base AS (
          SELECT 
            s.entries_id,
            s.id,
            GROUP_CONCAT(DISTINCT si.extra_info) as sense_info,
            GROUP_CONCAT(DISTINCT d.dialect_info) as dialect,
            GROUP_CONCAT(DISTINCT sk.kanjis_restricted_to) as stagk,
            GROUP_CONCAT(DISTINCT sr.readings_restricted_to) as stagr,
            GROUP_CONCAT(DISTINCT g.word_info) as gloss,
            GROUP_CONCAT(DISTINCT a.ant_reference) as antonyms,
            GROUP_CONCAT(DISTINCT pos.pos_info) as parts_of_speech,
            GROUP_CONCAT(DISTINCT f.field_info) as field,
            GROUP_CONCAT(DISTINCT cr.cross_reference) as cross_reference,
            GROUP_CONCAT(DISTINCT m.misc_info) as misc,
            GROUP_CONCAT(DISTINCT ls.l_source) as loanword_source
          FROM senses s
          LEFT JOIN sense_info si ON si.senses_id = s.id
          LEFT JOIN dialect d ON d.senses_id = s.id
          LEFT JOIN stagk sk ON sk.senses_id = s.id
          LEFT JOIN stagr sr ON sr.senses_id = s.id
          LEFT JOIN gloss g ON g.senses_id = s.id
          LEFT JOIN antonyms a ON a.senses_id = s.id
          LEFT JOIN parts_of_speech pos ON pos.senses_id = s.id
          LEFT JOIN field f ON f.senses_id = s.id
          LEFT JOIN cross_references cr ON cr.senses_id = s.id
          LEFT JOIN misc m ON m.senses_id = s.id
          LEFT JOIN loanword_source ls ON ls.senses_id = s.id
          WHERE s.entries_id IN (${ent_ids})
          GROUP BY s.id
        )
        SELECT 
          entries_id AS ent_seq,
          json_object(
            'ent_seq', entries_id,
            'id', COALESCE(id, ''),
            'sense_info', COALESCE(json_array(sense_info), json_array()),
            'dialect', COALESCE(json_array(dialect), json_array()),
            'stagk', COALESCE(json_array(stagk), json_array()),
            'stagr', COALESCE(json_array(stagr), json_array()),
            'gloss', COALESCE(json_array(gloss), json_array()),
            'antonyms', COALESCE(json_array(antonyms), json_array()),
            'parts_of_speech', COALESCE(json_array(parts_of_speech), json_array()),
            'field', COALESCE(json_array(field), json_array()),
            'cross_reference', COALESCE(json_array(cross_reference), json_array()),
            'misc', COALESCE(json_array(misc), json_array()),
            'loanword_source', COALESCE(json_array(loanword_source), json_array())
          ) AS sense_data
        FROM sense_base;
      `;
      const rows = await db.getAllAsync(query, []);
      if (rows.length === 0) {
        resolve(null);
      } else {
        const senses = rows.map(row => JSON.parse(row.sense_data));
        resolve(senses);
      }
    } catch (err) {
      console.log("Error occured in fetchSenses: ", err)
      reject(err);
    }
  });
}

export async function fetchEntryDetails(ent_seq_array, db) {
  // Fetchs all data for all entries at once
  //const startTime = performance.now();
  const [allKanjiElements, allReadingElements, allSenses] = await Promise.all([
    fetchKanjiElements(ent_seq_array, db),
    fetchReadingElements(ent_seq_array, db),
    fetchSenses(ent_seq_array, db)
  ]);
  // Loops through the entrys and sorts it by ent_seq
  const entryDetails = ent_seq_array.map(ent_seq => {
    const kanji = allKanjiElements ? allKanjiElements.filter(element => element.ent_seq === ent_seq) : [];
    const reading = allReadingElements ? allReadingElements.filter(element => element.ent_seq === ent_seq) : [];
    const sense = allSenses ? allSenses.filter(element => element.ent_seq === ent_seq) : [];

    return {
      ent_seq,
      kanji_elements: kanji.length > 0 ? kanji : null,
      reading_elements: reading.length > 0 ? reading : null,
      senses: sense.length > 0 ? sense : null
    };
  });
  //const endTime = performance.now();
  //console.log(`Fetching entry details completed in ${(endTime - startTime).toFixed(2)} ms`);
  return entryDetails;
}
// Backup func
export async function fetchEntryDetails1(ent_seq_array, db) {
  const entryDetails = await Promise.all(
    ent_seq_array.map(async (ent_seq) => {
      const [kanjiElements, readingElements, senses] = await Promise.all([
        fetchKanjiElements(ent_seq, db),
        fetchReadingElements(ent_seq, db),
        fetchSenses(ent_seq, db)
      ]);

      return {
        ent_seq,
        kanji_elements: kanjiElements,
        reading_elements: readingElements,
        senses: senses
      };
    })
  );

  return entryDetails;
}
// Test functions
// async function displayEntryDetails(userInput) {
//   try {
//     // The awaits pause each execution so that the query has time to finish before the rest of the code runs
//     const entryIDs = await searchByGloss(userInput);
//     const wordDetails = await fetchEntryDetails(entryIDs)

//     if (wordDetails) {
//       console.log(wordDetails)
//     } else {
//       console.log('No details found for this entry');
//     }
//   } catch (err) {
//     console.error('Error fetching details:', err.message);
//   }
// }

// // Testing
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('Enter something to search: ', (userInput) => {
//   displayEntryDetails(userInput)
//   rl.close();
// })