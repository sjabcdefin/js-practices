#!/usr/bin/env node

import sqlite3 from "sqlite3";

sqlite3.verbose();
const db = new sqlite3.Database(":memory:");

const createTableQuery =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE);";
const insertRowQuery = "INSERT INTO books (title) VALUES (?)";
const selectAllRowsQuery = "SELECT * FROM books";
const dropTableQuery = "DROP TABLE books";

const titles = ["I Am a Cat", "KOKORO", "SANSHIRO"];

db.run(createTableQuery, () => {
  console.log("Table was created successfully");
  db.run(insertRowQuery, titles[0], function () {
    console.log(`Record was inserted successfully with ID: ${this.lastID}`);
    db.run(insertRowQuery, titles[1], function () {
      console.log(`Record was inserted successfully with ID: ${this.lastID}`);
      db.run(insertRowQuery, titles[2], function () {
        console.log(`Record was inserted successfully with ID: ${this.lastID}`);
        db.all(selectAllRowsQuery, (err, rows) => {
          console.log("All records were fetched successfully");
          for (const row of rows) {
            console.log(`id:${row.id}, title:${row.title}`);
          }
          db.run(dropTableQuery, () => {
            console.log("Table was deleted successfully");
            db.close();
          });
        });
      });
    });
  });
});
