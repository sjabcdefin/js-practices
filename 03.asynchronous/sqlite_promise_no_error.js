#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { runQueryAsync, allQueryAsync } from "./sqlite_utils.js";

sqlite3.verbose();
const db = new sqlite3.Database(":memory:");

const createTableQuery =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE);";
const insertBookRecordQuery = "INSERT INTO books (title) VALUES (?)";
const selectAllQuery = "SELECT * FROM books";
const deleteTableQuery = "DROP TABLE books";

const titles = ["I Am a Cat", "KOKORO", "SANSHIRO"];

function main() {
  return runQueryAsync(db, createTableQuery)
    .then(function () {
      console.log("Table created");
      const requests = titles.map(function (title) {
        return runQueryAsync(db, insertBookRecordQuery, [title]).then(
          function (result) {
            console.log(
              `Record inserted successfully with ID: ${result.lastID}`,
            );
          },
        );
      });
      return Promise.all(requests);
    })
    .then(function () {
      return allQueryAsync(db, selectAllQuery);
    })
    .then(function (rows) {
      console.log("All records fetched successfully");
      for (const row of rows) {
        console.log(`id:${row.id}, title:${row.title}`);
      }
      return runQueryAsync(db, deleteTableQuery);
    })
    .then(function () {
      console.log("Table deleted");
    })
    .finally(function () {
      db.close();
    });
}

main();
