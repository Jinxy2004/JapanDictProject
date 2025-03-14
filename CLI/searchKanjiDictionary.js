// Import the sqlite3 package
const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const wanakana = require('wanakana');
const db = new sqlite3.Database("testDatabases/test_total.db");


function searchByMeaning(userInput) {
  /* 
  Most queries will work like this
  Basically, it selects whatever needs to be displayed, 
  then it searches through a table to find a specific id,
  that id is then returned and matched up to any id's in the original table it was trying to find.
  So, this one searches in the meanings table for any meanings that match, if it finds a meaning that matches
  it will then return those id's of the matching meanings.
  These ids then go back to the where statement where it acts like multiple = statements returning all
  of the selected rows based on the kanji id

  */
  const query = `
  SELECT kanji.*, GROUP_CONCAT(kanji_meanings.meaning,', ') AS meanings FROM kanji 
  JOIN kanji_meanings ON kanji.id = kanji_meanings.kanji_id WHERE 
  kanji.id IN (
    SELECT kanji_id FROM kanji_meanings WHERE
    meaning LIKE ?  OR meaning = ?
  )
  GROUP BY kanji.id
  ORDER BY kanji.id
  LIMIT 10;
  `;

  // An array of params that are fed to the retrieval function for conditions
  const params = [
    `%${userInput}%`,
    userInput
  ];

  db.all(query,params,(err,rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(rows);
  });
}

// Allows the user to search by the ony or kun reading, and returns all information about the kanji
function searchByReading(userInput) {
  const query = `
  SELECT kanji.*, 
  GROUP_CONCAT(DISTINCT kanji_meanings.meaning) AS kanji_meanings,
  GROUP_CONCAT(DISTINCT kanji_on_readings.on_reading) AS ony_readings, 
  GROUP_CONCAT(DISTINCT kanji_kun_readings.kun_reading) AS kun_readings FROM kanji 
  LEFT JOIN kanji_on_readings ON kanji.id = kanji_on_readings.kanji_id
  LEFT JOIN kanji_kun_readings ON kanji.id = kanji_kun_readings.kanji_id
  LEFT JOIN kanji_meanings ON kanji.id = kanji_meanings.kanji_id
  WHERE 
  kanji.id IN (
    SELECT kanji_id FROM kanji_on_readings WHERE
    REPLACE(on_reading,'.','' )LIKE ?  OR REPLACE(on_reading,'.','') = ?
  )
  OR
  kanji.id IN (
    SELECT kanji_id FROM kanji_kun_readings WHERE
    REPLACE(kun_reading,'.','') LIKE ? OR REPLACE(kun_reading,'.','') = ?
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

  db.all(query,params,(err,rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(rows);
  });

}

// If input is Japanese, it will either via reading of a word, meaning

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter something to search: ', (word) => {

  // searchByMeaning(word);
  searchByReading(word)
  rl.close();
})



