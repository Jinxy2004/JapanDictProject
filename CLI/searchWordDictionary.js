const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const wanakana = require('wanakana');
const db = new sqlite3.Database("testDatabases/test_total.db");

const query = `
  
  `;

// An array of params that are fed to the retrieval function for conditions
const params = [
  `%${userInput}%`,
  userInput
];

db.all(query, params, (err, rows) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log(rows);
});