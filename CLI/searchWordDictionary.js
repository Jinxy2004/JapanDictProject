const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const wanakana = require('wanakana');
const db = new sqlite3.Database("testDatabases/test_total.db");

