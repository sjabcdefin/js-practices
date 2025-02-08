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
const insertRecordQuery = "INSERT INTO books (title) VALUES (?)";
const selectAllQuery = "SELECT * FROM movies";
const dropTableQuery = "DROP TABLE books";

const titles = ["I Am a Cat", "I Am a Cat", "SANSHIRO"];

runQueryAsync(db, createTableQuery)
  .then(() => {
    console.log("Table was created successfully");
    return runQueryAsync(db, insertRecordQuery, titles[0]);
  })
  .then((result) => {
    console.log(`Record was inserted successfully with ID: ${result.lastID}`);
  })
  .catch((err) => {
    console.error(`Error occurred while inserting record: ${err.message}`);
  })
  .then(() => {
    return runQueryAsync(db, insertRecordQuery, titles[1]);
  })
  .then((result) => {
    console.log(`Record was inserted successfully with ID: ${result.lastID}`);
  })
  .catch((err) => {
    console.error(`Error occurred while inserting record: ${err.message}`);
  })
  .then(() => {
    return runQueryAsync(db, insertRecordQuery, titles[2]);
  })
  .then((result) => {
    console.log(`Record was inserted successfully with ID: ${result.lastID}`);
  })
  .catch((err) => {
    if (err.code === "SQLITE_CONSTRAINT") {
      console.error(`Error occurred while inserting record: ${err.message}`);
    }
  })
  .then(() => {
    return allQueryAsync(db, selectAllQuery);
  })
  .then((rows) => {
    console.log("All records were fetched successfully");
    for (const row of rows) {
      console.log(`id:${row.id}, title:${row.title}`);
    }
  })
  .catch((err) => {
    if (err.code === "SQLITE_ERROR") {
      console.error(`Error occurred while fetching records: ${err.message}`);
    }
  })
  .then(() => {
    return runQueryAsync(db, dropTableQuery);
  })
  .then(() => {
    console.log("Table was deleted successfully");
  })
  .finally(() => {
    return closeQueryAsync(db);
  });
