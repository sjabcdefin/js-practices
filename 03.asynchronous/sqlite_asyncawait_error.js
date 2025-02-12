#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  runQueryAsync,
  allQueryAsync,
  closeQueryAsync,
} from "./sqlite_utils.js";

sqlite3.verbose();
const db = new sqlite3.Database(":memory:");

const createTableQuery =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE);";
const insertRowQuery = "INSERT INTO books (title) VALUES (?)";
const selectAllRowsQuery = "SELECT * FROM movies";
const dropTableQuery = "DROP TABLE books";

const titles = ["I Am a Cat", "I Am a Cat", "SANSHIRO"];

(async () => {
  await runQueryAsync(db, createTableQuery);
  console.log("Table was created successfully");

  for (const title of titles) {
    try {
      const result = await runQueryAsync(db, insertRowQuery, [title]);
      console.log(`Record was inserted successfully with ID: ${result.lastID}`);
    } catch (err) {
      if (err.code === "SQLITE_CONSTRAINT") {
        console.error(`Error occurred while inserting record: ${err.message}`);
      }
    }
  }

  try {
    const rows = await allQueryAsync(db, selectAllRowsQuery);
    console.log("All records were fetched successfully");
    for (const row of rows) {
      console.log(`id:${row.id}, title:${row.title}`);
    }
  } catch (err) {
    if (err.code === "SQLITE_ERROR") {
      console.error(`Error occurred while fetching records: ${err.message}`);
    }
  }

  await runQueryAsync(db, dropTableQuery);
  console.log("Table was deleted successfully");

  await closeQueryAsync(db);
})();
