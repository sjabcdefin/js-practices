#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { runQueryAsync, allQueryAsync } from "./sqlite_utils.js";

sqlite3.verbose();
const db = new sqlite3.Database(":memory:");

const createTableQuery = `
  CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE
  )
`;
const insertTitleQuery = `INSERT INTO books (title) VALUES (?)`;
const selectAllQuery = `SELECT * FROM books`;
const deleteTableQuery = `DROP TABLE books`;

const titles = ["I Am a Cat", "KOKORO", "SANSHIRO"];

async function main() {
  await runQueryAsync(db, createTableQuery);
  console.log("Table created");

  for (const title of titles) {
    const result = await runQueryAsync(db, insertTitleQuery, [title]);
    console.log(`Record inserted successfully with ID: ${result.lastID}`);
  }

  const rows = await allQueryAsync(db, selectAllQuery);
  console.log("All records fetched successfully");
  for (const row of rows) {
    console.log(`id:${row.id}, title:${row.title}`);
  }

  await runQueryAsync(db, deleteTableQuery);
  console.log("Table deleted");
  db.close();
}

main();
