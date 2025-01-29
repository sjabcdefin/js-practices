#!/usr/bin/env node

import sqlite3 from "sqlite3";

sqlite3.verbose();
const db = new sqlite3.Database(":memory:");

const createTableQuery =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE);";
const insertTitleQuery = "INSERT INTO books (title) VALUES (?)";
const selectAllQuery = "SELECT * FROM books";
const deleteTableQuery = "DROP TABLE books";

const titles = ["I Am a Cat", "KOKORO", "SANSHIRO"];

db.run(createTableQuery, [], function () {
  console.log("Table created");
  db.run(insertTitleQuery, titles[0], function () {
    console.log(`Record inserted successfully with ID: ${this.lastID}`);
    db.run(insertTitleQuery, titles[1], function () {
      console.log(`Record inserted successfully with ID: ${this.lastID}`);
      db.run(insertTitleQuery, titles[2], function () {
        console.log(`Record inserted successfully with ID: ${this.lastID}`);
        db.all(selectAllQuery, [], (err, rows) => {
          console.log("All records fetched successfully");
          for (const row of rows) {
            console.log(`id:${row.id}, title:${row.title}`);
          }
          db.run(deleteTableQuery, [], function () {
            console.log("Table deleted");
            db.close();
          });
        });
      });
    });
  });
});
