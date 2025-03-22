import { createInterface } from "node:readline/promises";
import enquirer from "enquirer";
import MemoModel from "./memo_model.js";
import MemoDatabase from "./memo_database.js";

class MemoApp {
  #database;

  constructor() {
    this.#database = new MemoDatabase("memo.db");
    process.on("SIGINT", async () => {
      await this.#cleanupAndExit();
    });
  }

  async runOperationBasedOnOption() {
    try {
      const option = this.#parseCommandLineOption();
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

  async #cleanupAndExit() {
    console.log("\nCtrl+C was detected during operation.");
    await this.#database.closeDatabase();
    process.exit(1);
  }

  #hasMultipleOptions() {
    return process.argv.slice(2).length > 1;
  }

  #isInvalidOption(inputOption) {
    const options = ["-l", "-r", "-d", undefined];
    return !options.includes(inputOption);
  }

  #parseCommandLineOption() {
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
    const inputLines = [];
    try {
      for await (const line of rl) {
        inputLines.push(line);
      }
      return inputLines.join("\n");
    } finally {
      rl.close();
    }
  }

  async #selectMemo(action) {
    const memos = await this.#fetchMemos();
    const memosForPrompt = memos.map((memo) => ({
      name: memo.firstLineOfContent,
      value: memo,
    }));

    try {
      const question = [
        {
          type: "select",
          name: "memo",
          message: `Choose a note you want to ${action}:`,
          choices: memosForPrompt,
          result() {
            return this.focused.value;
          },
        },
      ];
      return await enquirer.prompt(question);
    } catch (err) {
      if (err === "") {
        await this.#cleanupAndExit();
      } else {
        throw err;
      }
    }
  }

  async #fetchMemos() {
    const rows = await this.#database.selectAll();
    if (!rows.length) {
      throw new Error(
        "No memos available. Use the app without options to add a new memo.",
      );
    }
    return rows.map((row) => new MemoModel(row.id, row.content));
  }

  async #addMemo() {
    const content = await this.#readMemoContentFromInput();
    if (content === "") {
      throw new Error("Memo content cannot be empty. Please enter some text.");
    }
    await this.#database.insert(content);
  }

  async #displayMemos() {
    const memos = await this.#fetchMemos();
    memos.forEach((memo) => {
      console.log(memo.firstLineOfContent);
    });
  }

  async #displayMemoContent() {
    const answer = await this.#selectMemo("see");
    console.log(answer.memo.content);
  }

  async #deleteMemo() {
    const answer = await this.#selectMemo("delete");
    await this.#database.delete(answer.memo.id);
  }
}

export default MemoApp;
