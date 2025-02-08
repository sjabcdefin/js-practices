#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { runQueryAsync, allQueryAsync } from "./sqlite_utils.js";

sqlite3.verbose();
const db = new sqlite3.Database(":memory:");

const createTableQuery =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE);";
const insertRecordQuery = "INSERT INTO books (title) VALUES (?)";
const selectAllQuery = "SELECT * FROM books";
const dropTableQuery = "DROP TABLE books";

const titles = ["I Am a Cat", "KOKORO", "SANSHIRO"];

(async () => {
  await runQueryAsync(db, createTableQuery);
  console.log("Table was created successfully");

  for (const title of titles) {
    const result = await runQueryAsync(db, insertRecordQuery, [title]);
    console.log(`Record was inserted successfully with ID: ${result.lastID}`);
  }

  const rows = await allQueryAsync(db, selectAllQuery);
  console.log("All records were fetched successfully");
  for (const row of rows) {
    console.log(`id:${row.id}, title:${row.title}`);
  }

  await runQueryAsync(db, dropTableQuery);
  console.log("Table was deleted successfully");
  db.close();
})();
