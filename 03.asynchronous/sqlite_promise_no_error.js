#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  runQueryAsync,
  allQueryAsync,
  closeDatabaseAsync,
} from "./sqlite_utils.js";

sqlite3.verbose();
const db = new sqlite3.Database(":memory:");

const createTableQuery =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE);";
const insertRowQuery = "INSERT INTO books (title) VALUES (?)";
const selectAllRowsQuery = "SELECT * FROM books";
const dropTableQuery = "DROP TABLE books";

const titles = ["I Am a Cat", "KOKORO", "SANSHIRO"];

runQueryAsync(db, createTableQuery)
  .then(() => {
    console.log("Table was created successfully");
    return runQueryAsync(db, insertRowQuery, titles[0]);
  })
  .then((result) => {
    console.log(`Record was inserted successfully with ID: ${result.lastID}`);
    return runQueryAsync(db, insertRowQuery, titles[1]);
  })
  .then((result) => {
    console.log(`Record was inserted successfully with ID: ${result.lastID}`);
    return runQueryAsync(db, insertRowQuery, titles[2]);
  })
  .then((result) => {
    console.log(`Record was inserted successfully with ID: ${result.lastID}`);
    return allQueryAsync(db, selectAllRowsQuery);
  })
  .then((rows) => {
    console.log("All records were fetched successfully");
    for (const row of rows) {
      console.log(`id:${row.id}, title:${row.title}`);
    }
    return runQueryAsync(db, dropTableQuery);
  })
  .then(() => {
    console.log("Table was deleted successfully");
  })
  .finally(() => {
    return closeDatabaseAsync(db);
  });
