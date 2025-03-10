import { createInterface } from "node:readline/promises";
import enquirer from "enquirer";
import MemoModel from "./memo_model.js";
import MemoDatabase from "./memo_database.js";

class MemoApp {
  #database;

  constructor() {
    this.#database = new MemoDatabase("memo.db");
  }

  async executeMemoCommand() {
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
      if (err instanceof Error) {
        console.error(`Error: ${err.message}`);
      } else {
        console.error("An unknown error occurred.");
      }
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
    if (this.#hasMultipleOptions()) {
      throw new Error("Only one option is allowed. Use one of: -l, -r, -d.");
    }
    if (this.#isInvalidOption(option)) {
      throw new Error("Invalid option. Available options: -l, -r, -d.");
    }
    return option;
  }

  async #readMemoContentFromInput() {
    const rl = createInterface({
      input: process.stdin,
    });
    let memoContents = [];
    try {
      for await (const line of rl) {
        memoContents.push(line);
      }
      return memoContents.join("\n");
    } finally {
      rl.close();
    }
  }

  async #selectMemo(action) {
    const memos = await this.#fetchMemosForEnquirerPrompt();
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
      if (err === "") {
        throw new Error("Selecting memo was canceled.");
      } else {
        throw err;
      }
    }
  }

  async #fetchMemosForEnquirerPrompt() {
    const memos = await new MemoModel().fetchAll(this.#database);
    return memos.map((memo) => ({
      name: memo.content.split("\n")[0],
      value: memo.id,
    }));
  }

  async #addMemo() {
    const content = await this.#readMemoContentFromInput();
    await new MemoModel({ content: content }).save(this.#database);
  }

  async #displayMemos() {
    const memos = await this.#fetchMemosForEnquirerPrompt();
    memos.forEach((memo) => {
      console.log(memo.name);
    });
  }

  async #displayMemoContent() {
    const answer = await this.#selectMemo("see");
    const memo = new MemoModel({ id: answer.memoId });
    await memo.fetchById(this.#database);
    console.log(memo.content);
  }

  async #deleteMemo() {
    const answer = await this.#selectMemo("delete");
    await new MemoModel({ id: answer.memoId }).delete(this.#database);
  }
}

export default MemoApp;
