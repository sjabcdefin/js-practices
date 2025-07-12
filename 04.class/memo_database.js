import sqlite3 from "sqlite3";
import { runQuery, allQuery, closeDatabase } from "./sqlite_utils.js";

class MemoDatabase {
  static #createTableQuery =
    "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)";
  static #insertMemoQuery = "INSERT INTO memos (content) VALUES (?)";
  static #selectAllMemoQuery = "SELECT * FROM memos ORDER BY id";
  static #deleteMemoQuery = "DELETE FROM memos WHERE id = ?";

  #db;

  constructor(dbPath) {
    sqlite3.verbose();
    this.#db = new sqlite3.Database(dbPath);
  }

  async createTable() {
    await runQuery(this.#db, MemoDatabase.#createTableQuery);
  }

  async insert(content) {
    return await runQuery(this.#db, MemoDatabase.#insertMemoQuery, [content]);
  }

  async selectAll() {
    return await allQuery(this.#db, MemoDatabase.#selectAllMemoQuery);
  }

  async delete(id) {
    await runQuery(this.#db, MemoDatabase.#deleteMemoQuery, [id]);
  }

  async closeDatabase() {
    await closeDatabase(this.#db);
  }
}

export default MemoDatabase;
