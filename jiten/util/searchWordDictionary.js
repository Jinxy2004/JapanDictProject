const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const wanakana = require('wanakana');
const db = new sqlite3.Database("testDatabases/test_total.db");

// Function that returns a list of entry ids for rest of queries
function searchByGloss(userInput) {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT ent_seq FROM entries
    JOIN senses ON entries.ent_seq = senses.entries_id
    JOIN gloss ON gloss.senses_id = senses.id
    WHERE 
      gloss.word_info LIKE ? OR 
      gloss.word_info LIKE ? OR 
      gloss.word_info LIKE ? OR
      gloss.word_info LIKE ? OR
      gloss.word_info LIKE ? OR 
      gloss.word_info LIKE ? 
    GROUP BY ent_seq
    ORDER BY ent_seq
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
        const ent_ids = rows.map(row => row.ent_seq);
        resolve(ent_ids);
      }
    });
  });
}

// Function that returns a list of entry ids for rest of queries
function searchByReadingElement(userInput) {
  return new Promise((resolve, reject) => {
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
    ORDER BY ent_seq
    LIMIT 10; 
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

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const ent_ids = rows.map(row => row.ent_seq);
        resolve(ent_ids);
      }
    });
  });
}

function serachByKanjiElement(userInput) {
  return new Promise((resolve, reject) => {
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
    ORDER BY ent_seq
    LIMIT 10; 
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

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const ent_ids = rows.map(row => row.ent_seq);
        resolve(ent_ids);
      }
    });
  });
}

// These three functions fetch all the related details based on the entry ids
function fetchReadingElements(ent_id) {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT 
      json_object(
        'id', reading_elements.id,
        'word_reading', reading_elements.word_reading,
        'no_kanji', reading_elements.no_kanji,
        'restricted_readings', (
          SELECT json_group_array(restricted_reading)
          FROM readings_restricted
          WHERE readings_restricted.reading_elements_id = reading_elements.id
        ),
        'reading_priorities', (
          SELECT json_group_array(re_priority_info)
          FROM readings_priority
          WHERE readings_priority.reading_elements_id = reading_elements.id
        ),
        'reading_info', (
          SELECT json_group_array(specific_info)
          FROM readings_info
          WHERE readings_info.reading_elements_id = reading_elements.id
        )
      ) AS reading_data
    FROM reading_elements
    WHERE reading_elements.entries_id = ?;
    `;

    db.all(query, [ent_id], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows.length === 0) {
        resolve(null)
      } else {
        const readingElements = rows.map(row => JSON.parse(row.reading_data));
        resolve(readingElements);
      }
    });

  })
}

function fetchKanjiElements(ent_id) {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT 
      json_object(
        'id', kanji_elements.id,
        'keb_element', kanji_elements.keb_element,
        'kanji_info', (
          SELECT json_group_array(k_info)
          FROM kanji_info
          WHERE kanji_info.kanji_elements_id = kanji_elements.id
        ),
        'kanji_priority', (
          SELECT json_group_array(k_priority_info)
          FROM kanji_priority
          WHERE kanji_priority.kanji_elements_id = kanji_elements.id
        )
      ) AS kanji_data
    FROM kanji_elements
    WHERE kanji_elements.entries_id = ?;
      `;

    db.all(query, [ent_id], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows.length === 0) {
        resolve(null)
      } else {
        const kanjiElements = rows.map(row => JSON.parse(row.kanji_data));
        resolve(kanjiElements);
      }
    });
  })
}

function fetchSenses(ent_id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        json_object(
          'id', senses.id,
          'sense_info', (
            SELECT json_group_array(extra_info)
            FROM sense_info
            WHERE sense_info.senses_id = senses.id
          ),
          'dialect', (
            SELECT json_group_array(dialect_info)
            FROM dialect
            WHERE dialect.senses_id = senses.id
          ),
          'stagk', (
            SELECT json_group_array(kanjis_restricted_to)
            FROM stagk
            WHERE stagk.senses_id = senses.id
          ),
          'stagr', (
            SELECT json_group_array(readings_restricted_to)
            FROM stagr
            WHERE stagr.senses_id = senses.id
          ),
          'gloss', (
            SELECT json_group_array(word_info)
            FROM gloss
            WHERE gloss.senses_id = senses.id
          ),
          'antonyms', (
            SELECT json_group_array(ant_reference)
            FROM antonyms
            WHERE antonyms.senses_id = senses.id
          ),
          'parts_of_speech', (
            SELECT json_group_array(pos_info)
            FROM parts_of_speech
            WHERE parts_of_speech.senses_id = senses.id
          ),
          'field', (
            SELECT json_group_array(field_info)
            FROM field
            WHERE field.senses_id = senses.id
          ),
          'cross_reference', (
            SELECT json_group_array(cross_reference)
            FROM cross_references
            WHERE cross_references.senses_id = senses.id
          ),
          'misc', (
            SELECT json_group_array(misc_info)
            FROM misc
            WHERE misc.senses_id = senses.id
          ),
          'loanword_source', (
            SELECT json_group_array(l_source)
            FROM loanword_source
            WHERE loanword_source.senses_id = senses.id
          )
        ) AS sense_data
      FROM senses
      WHERE senses.entries_id = ?;
      `;

    db.all(query, [ent_id], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows.length === 0) {
        resolve(null)
      } else {
        const senses = rows.map(row => JSON.parse(row.sense_data));
        resolve(senses);
      }
    });
  })
}

async function fetchEntryDetails(ent_seq_array) {
  const entryDetails = await Promise.all(
    ent_seq_array.map(async (ent_seq) => {
      const kanjiElements = await fetchKanjiElements(ent_seq);
      const readingElements = await fetchReadingElements(ent_seq);
      const senses = await fetchSenses(ent_seq);

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
async function displayEntryDetails(userInput) {
  try {
    // The awaits pause each execution so that the query has time to finish before the rest of the code runs
    const entryIDs = await searchByGloss(userInput);
    const wordDetails = await fetchEntryDetails(entryIDs)

    if (wordDetails) {
      console.log(wordDetails)
    } else {
      console.log('No details found for this entry');
    }
  } catch (err) {
    console.error('Error fetching details:', err.message);
  }
}

// Testing
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter something to search: ', (userInput) => {
  displayEntryDetails(userInput)
  rl.close();
})