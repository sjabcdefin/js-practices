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
const selectAllQuery = `SELECT * FROM movies`;
const deleteTableQuery = `DROP TABLE books`;

const titles = ["I Am a Cat", "I Am a Cat", "SANSHIRO"];

async function main() {
  await runQueryAsync(db, createTableQuery);
  console.log("Table created");

  for (const title of titles) {
    try {
      const result = await runQueryAsync(db, insertTitleQuery, [title]);
      console.log(`Record inserted successfully with ID: ${result.lastID}`);
    } catch (err) {
      console.error(`Error occurred while inserting record: ${err.message}`);
    }
  }

  try {
    const rows = await allQueryAsync(db, selectAllQuery);
    console.log("All records fetched successfully");
    for (const row of rows) {
      console.log(`id:${row.id}, title:${row.title}`);
    }
  } catch (err) {
    console.error(`Error occurred while fetching records: ${err.message}`);
  }

  await runQueryAsync(db, deleteTableQuery);
  console.log("Table deleted");
  db.close();
}

main();
