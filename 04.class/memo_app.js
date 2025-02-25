import { createInterface } from "node:readline/promises";
import enquirer from "enquirer";
import Memo from "./memo.js";
import MemoDatabase from "./memo_database.js";

class MemoApp {
  #database;

  constructor() {
    this.#database = new MemoDatabase("memo.db");
  }

  async handleOption() {
    try {
      const option = this.#commandLineOption();
      await this.#database.createTable();
      switch (option) {
        case "-l":
          await this.#displayMemos();
          break;
        case "-r":
          await this.#displayMemoContent();
          break;
        case "-d":
          await this.#deleteMemo();
          break;
        case undefined:
          await this.#addMemo();
      }
    } catch (err) {
      if (err instanceof Error) console.error(`Error: ${err.message}`);
      else console.error("An unknown error occurred.");
    } finally {
      await this.#database.closeDatabase();
    }
  }

  #hasMultipleOptions() {
    return process.argv.slice(2).length > 1;
  }

  #isInvalidOption(inputOption) {
    const options = ["-l", "-r", "-d", undefined];
    return !options.includes(inputOption);
  }

  #commandLineOption() {
    const option = process.argv[2];
    if (this.#hasMultipleOptions())
      throw new Error("Only one option is allowed. Use one of: -l, -r, -d.");
    if (this.#isInvalidOption(option))
      throw new Error("Invalid option. Available options: -l, -r, -d.");
    return option;
  }

  async #inputMemo() {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    let memoContent = "";
    try {
      for await (const line of rl) {
        memoContent += line + "\n";
      }
      return memoContent.trimEnd();
    } finally {
      rl.close();
    }
  }

  async #selectMemo(action = "see") {
    const memos = await this.#fetchMemos();
    try {
      const { prompt } = enquirer;
      const question = [
        {
          type: "select",
          name: "memoId",
          message: `Choose a note you want to ${action}:`,
          choices: memos,
          result() {
            return this.focused.value;
          },
        },
      ];
      return await prompt(question);
    } catch (err) {
      if (!err) throw new Error("Selecting memo was canceled.");
      throw err;
    }
  }

  async #fetchMemos() {
    const rows = await new Memo(this.#database).fetchAll();
    return rows.map((row) => ({
      name: row.content.split("\n")[0],
      value: row.id,
    }));
  }

  async #addMemo() {
    const content = await this.#inputMemo();
    await new Memo(this.#database, undefined, content).save();
  }

  async #displayMemos() {
    const memos = await this.#fetchMemos();
    memos.forEach((memo) => console.log(memo.name));
  }

  async #displayMemoContent() {
    const answer = await this.#selectMemo();
    const memo = new Memo(this.#database, answer.memoId);
    await memo.fetchById();
    console.log(memo.content);
  }

  async #deleteMemo() {
    const answer = await this.#selectMemo("delete");
    await new Memo(this.#database, answer.memoId).delete();
  }
}

export default MemoApp;
