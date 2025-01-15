#!/usr/bin/env node

import sqlite3 from "sqlite3";

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
let insertCount = 0;

function main() {
  createTable();
}

function createTable() {
  db.run(createTableQuery, insertTitles);
}

function insertTitles() {
  console.log("Table created");
  for (const title of titles) {
    db.run(insertTitleQuery, [title], displayID);
  }
}

function displayID() {
  console.log(`Record inserted successfully with ID: ${this.lastID}`);
  insertCount++;
  if (insertCount === titles.length) {
    fetchAll();
  }
}

function fetchAll() {
  db.all(selectAllQuery, displayAll);
}

function displayAll(err, rows) {
  console.log("All records fetched successfully");
  for (const row of rows) {
    console.log(`id:${row.id}, title:${row.title}`);
  }
  deleteTable();
}

function deleteTable() {
  db.run(deleteTableQuery, closeDB);
}

function closeDB() {
  console.log("Table deleted");
  db.close();
}

main();
