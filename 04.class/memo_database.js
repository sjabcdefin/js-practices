import sqlite3 from "sqlite3";
import { runQuery, allQuery, getQuery, closeDatabase } from "./sqlite_utils.js";

const createTableQuery = `
CREATE TABLE IF NOT EXISTS memos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL
)
`;
const insertMemoQuery = `INSERT INTO memos (content) VALUES (?)`;
const selectAllMemoQuery = `SELECT * FROM memos`;
const selectMemoQuery = `SELECT * FROM memos WHERE id = (?)`;
const deleteMemoQuery = `DELETE FROM memos WHERE id = (?)`;

class MemoDatabase {
  #db;

  constructor(dbPath) {
    sqlite3.verbose();
    this.#db = new sqlite3.Database(dbPath);
  }

  async createTable() {
    await runQuery(this.#db, createTableQuery);
  }

  async add(content) {
    return await runQuery(this.#db, insertMemoQuery, [content]);
  }

  async getAll() {
    return await allQuery(this.#db, selectAllMemoQuery);
  }

  async getById(memoID) {
    return await getQuery(this.#db, selectMemoQuery, [memoID]);
  }

  async delete(memoID) {
    await runQuery(this.#db, deleteMemoQuery, [memoID]);
  }

  async closeDatabase() {
    await closeDatabase(this.#db);
  }
}

export default MemoDatabase;
