#!/usr/bin/env node

import sqlite3 from "sqlite3";

sqlite3.verbose();
const db = new sqlite3.Database(":memory:");

const createTableQuery =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE);";
const insertRowQuery = "INSERT INTO books (title) VALUES (?)";
const selectAllRowsQuery = "SELECT * FROM movies";
const dropTableQuery = "DROP TABLE books";

const titles = ["I Am a Cat", "I Am a Cat", "SANSHIRO"];

db.run(createTableQuery, () => {
  console.log("Table was created successfully");
  db.run(insertRowQuery, titles[0], function (err) {
    if (err) {
      console.error(`Error occurred while inserting record: ${err.message}`);
    } else {
      console.log(`Record was inserted successfully with ID: ${this.lastID}`);
    }
    db.run(insertRowQuery, titles[1], function (err) {
      if (err) {
        console.error(`Error occurred while inserting record: ${err.message}`);
      } else {
        console.log(`Record was inserted successfully with ID: ${this.lastID}`);
      }
      db.run(insertRowQuery, titles[2], function (err) {
        if (err) {
          console.error(
            `Error occurred while inserting record: ${err.message}`,
          );
        } else {
          console.log(
            `Record was inserted successfully with ID: ${this.lastID}`,
          );
        }
        db.all(selectAllRowsQuery, (err, rows) => {
          if (err) {
            console.error(
              `Error occurred while fetching records: ${err.message}`,
            );
          } else {
            console.log("All records were fetched successfully");
            for (const row of rows) {
              console.log(`id:${row.id}, title:${row.title}`);
            }
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
