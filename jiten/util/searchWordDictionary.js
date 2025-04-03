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
export function fetchReadingElements(ent_seq_array, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const ent_ids = ent_seq_array.join(',');
      const query = `
        SELECT 
          entries_id AS ent_seq,
          json_object(
            'ent_seq', entries_id,
            'id', COALESCE(reading_elements.id, ''),
            'word_reading', COALESCE(reading_elements.word_reading, ''),
            'no_kanji', COALESCE(reading_elements.no_kanji, ''),
            'restricted_readings', COALESCE(
              (SELECT json_group_array(COALESCE(restricted_reading, ''))
              FROM readings_restricted
              WHERE readings_restricted.reading_elements_id = reading_elements.id),
              json_array()
            ),
            'reading_priorities', COALESCE(
              (SELECT json_group_array(COALESCE(re_priority_info, ''))
              FROM readings_priority
              WHERE readings_priority.reading_elements_id = reading_elements.id),
              json_array()
            ),
            'reading_info', COALESCE(
              (SELECT json_group_array(COALESCE(specific_info, ''))
              FROM readings_info
              WHERE readings_info.reading_elements_id = reading_elements.id),
              json_array()
            )
          ) AS reading_data
        FROM reading_elements
        WHERE reading_elements.entries_id IN (${ent_ids});
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
        SELECT 
          entries_id AS ent_seq,
          json_object(
            'ent_seq', entries_id,
            'id', COALESCE(kanji_elements.id, ''),
            'keb_element', COALESCE(kanji_elements.keb_element, ''),
            'kanji_info', COALESCE(
              (SELECT json_group_array(COALESCE(k_info, ''))
               FROM kanji_info
               WHERE kanji_info.kanji_elements_id = kanji_elements.id),
              json_array()
            ),
            'kanji_priority', COALESCE(
              (SELECT json_group_array(COALESCE(k_priority_info, ''))
               FROM kanji_priority
               WHERE kanji_priority.kanji_elements_id = kanji_elements.id),
              json_array()
            )
          ) AS kanji_data
        FROM kanji_elements
        WHERE kanji_elements.entries_id IN (${ent_ids})
        GROUP BY kanji_elements.id;
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
        SELECT 
          entries_id AS ent_seq,
          json_object(
            'ent_seq', entries_id,
            'id', COALESCE(senses.id, ''),
            'sense_info', COALESCE(
              (SELECT json_group_array(COALESCE(extra_info, ''))
              FROM sense_info
              WHERE sense_info.senses_id = senses.id),
              json_array()
            ),
            'dialect', COALESCE(
              (SELECT json_group_array(COALESCE(dialect_info, ''))
              FROM dialect
              WHERE dialect.senses_id = senses.id),
              json_array()
            ),
            'stagk', COALESCE(
              (SELECT json_group_array(COALESCE(kanjis_restricted_to, ''))
              FROM stagk
              WHERE stagk.senses_id = senses.id),
              json_array()
            ),
            'stagr', COALESCE(
              (SELECT json_group_array(COALESCE(readings_restricted_to, ''))
              FROM stagr
              WHERE stagr.senses_id = senses.id),
              json_array()
            ),
            'gloss', COALESCE(
              (SELECT json_group_array(COALESCE(word_info, ''))
              FROM gloss
              WHERE gloss.senses_id = senses.id),
              json_array()
            ),
            'antonyms', COALESCE(
              (SELECT json_group_array(COALESCE(ant_reference, ''))
              FROM antonyms
              WHERE antonyms.senses_id = senses.id),
              json_array()
            ),
            'parts_of_speech', COALESCE(
              (SELECT json_group_array(COALESCE(pos_info, ''))
              FROM parts_of_speech
              WHERE parts_of_speech.senses_id = senses.id),
              json_array()
            ),
            'field', COALESCE(
              (SELECT json_group_array(COALESCE(field_info, ''))
              FROM field
              WHERE field.senses_id = senses.id),
              json_array()
            ),
            'cross_reference', COALESCE(
              (SELECT json_group_array(COALESCE(cross_reference, ''))
              FROM cross_references
              WHERE cross_references.senses_id = senses.id),
              json_array()
            ),
            'misc', COALESCE(
              (SELECT json_group_array(COALESCE(misc_info, ''))
              FROM misc
              WHERE misc.senses_id = senses.id),
              json_array()
            ),
            'loanword_source', COALESCE(
              (SELECT json_group_array(COALESCE(l_source, ''))
              FROM loanword_source
              WHERE loanword_source.senses_id = senses.id),
              json_array()
            )
          ) AS sense_data
        FROM senses
        WHERE senses.entries_id IN (${ent_ids})
        GROUP BY senses.id;
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
  const startTime = performance.now();
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
  const endTime = performance.now();
  console.log(`Fetching entry details completed in ${(endTime - startTime).toFixed(2)} ms`);
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