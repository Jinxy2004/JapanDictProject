function dbAllAsync(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
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
              COALESCE(GROUP_CONCAT(DISTINCT si.extra_info), '') as sense_info,
              COALESCE(GROUP_CONCAT(DISTINCT d.dialect_info), '') as dialect,
              COALESCE(GROUP_CONCAT(DISTINCT sk.kanjis_restricted_to), '') as stagk,
              COALESCE(GROUP_CONCAT(DISTINCT sr.readings_restricted_to), '') as stagr,
              COALESCE(GROUP_CONCAT(DISTINCT g.word_info), '') as gloss,
              COALESCE(GROUP_CONCAT(DISTINCT a.ant_reference), '') as antonyms,
              COALESCE(GROUP_CONCAT(DISTINCT pos.pos_info), '') as parts_of_speech,
              COALESCE(GROUP_CONCAT(DISTINCT f.field_info), '') as field,
              COALESCE(GROUP_CONCAT(DISTINCT cr.cross_reference), '') as cross_reference,
              COALESCE(GROUP_CONCAT(DISTINCT m.misc_info), '') as misc,
              COALESCE(GROUP_CONCAT(DISTINCT ls.l_source), '') as loanword_source,
              COALESCE(GROUP_CONCAT(DISTINCT jlpt.jlpt_level), '') as jlpt_level
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
            LEFT JOIN jlpt_levels jlpt ON jlpt.senses_id = s.id
            WHERE s.entries_id IN (${ent_ids})
            GROUP BY s.id
          )
          SELECT 
            entries_id AS ent_seq,
            json_object(
              'ent_seq', entries_id,
              'id', COALESCE(id, ''),
              'sense_info', CASE WHEN sense_info = '' THEN json_array() ELSE json_array(sense_info) END,
              'dialect', CASE WHEN dialect = '' THEN json_array() ELSE json_array(dialect) END,
              'stagk', CASE WHEN stagk = '' THEN json_array() ELSE json_array(stagk) END,
              'stagr', CASE WHEN stagr = '' THEN json_array() ELSE json_array(stagr) END,
              'gloss', CASE WHEN gloss = '' THEN json_array() ELSE json_array(gloss) END,
              'antonyms', CASE WHEN antonyms = '' THEN json_array() ELSE json_array(antonyms) END,
              'parts_of_speech', CASE WHEN parts_of_speech = '' THEN json_array() ELSE json_array(parts_of_speech) END,
              'field', CASE WHEN field = '' THEN json_array() ELSE json_array(field) END,
              'cross_reference', CASE WHEN cross_reference = '' THEN json_array() ELSE json_array(cross_reference) END,
              'misc', CASE WHEN misc = '' THEN json_array() ELSE json_array(misc) END,
              'loanword_source', CASE WHEN loanword_source = '' THEN json_array() ELSE json_array(loanword_source) END,
              'jlpt_level', CASE WHEN jlpt_level = '' THEN json_array() ELSE json_array(jlpt_level) END
            ) AS sense_data
          FROM sense_base;
        `;
      const rows = await dbAllAsync(db, query, []);
      if (!rows || rows.length === 0) {
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
              COALESCE(GROUP_CONCAT(DISTINCT ki.k_info), '') as kanji_info,
              COALESCE(GROUP_CONCAT(DISTINCT kp.k_priority_info), '') as kanji_priority
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
              'kanji_info', CASE WHEN kanji_info = '' THEN json_array() ELSE json_array(kanji_info) END,
              'kanji_priority', CASE WHEN kanji_priority = '' THEN json_array() ELSE json_array(kanji_priority) END
            ) AS kanji_data
          FROM kanji_base;
        `;

      const rows = await dbAllAsync(db, query, []);

      if (!rows || rows.length === 0) {
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
              COALESCE(GROUP_CONCAT(DISTINCT rr.restricted_reading), '') as restricted_readings,
              COALESCE(GROUP_CONCAT(DISTINCT rp.re_priority_info), '') as reading_priorities,
              COALESCE(GROUP_CONCAT(DISTINCT ri.specific_info), '') as reading_info
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
              'restricted_readings', CASE WHEN restricted_readings = '' THEN json_array() ELSE json_array(restricted_readings) END,
              'reading_priorities', CASE WHEN reading_priorities = '' THEN json_array() ELSE json_array(reading_priorities) END,
              'reading_info', CASE WHEN reading_info = '' THEN json_array() ELSE json_array(reading_info) END
            ) AS reading_data
          FROM reading_base;
        `;
      const rows = await dbAllAsync(db, query, []);

      if (!rows || rows.length === 0) {
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

export function fetchEntryIDsViaJLPT(JLPT_LEVEL, db) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `
                SELECT ent_seq FROM entries
                JOIN senses ON senses.entries_id = entries.ent_seq
                JOIN jlpt_levels ON jlpt_levels.senses_id = senses.id
                WHERE jlpt_levels.jlpt_level = (${JLPT_LEVEL});
            `

      const rows = await dbAllAsync(db, query, []);
      const results = rows.map(row => row.ent_seq);
      resolve(results);
    } catch (error) {
      console.error("Error fetching by JLPT: ", error);
      reject(error);
    }
  })
}

export async function fetchEntryDetails(ent_seq_array, db) {
  const [allKanjiElements, allReadingElements, allSenses] = await Promise.all([
    fetchKanjiElements(ent_seq_array, db),
    fetchReadingElements(ent_seq_array, db),
    fetchSenses(ent_seq_array, db)
  ]);
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
  console.log(entryDetails);
  return entryDetails;
}