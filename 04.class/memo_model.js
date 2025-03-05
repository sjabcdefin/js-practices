class MemoModel {
  #id;
  #content;

  constructor({ id = null, content = "" } = {}) {
    this.id = id;
    this.content = content;
  }

  get id() {
    return this.#id;
  }

  get content() {
    return this.#content;
  }

  set id(memoId) {
    this.#id = memoId;
  }
  set content(memoContent) {
    this.#content = memoContent;
  }

  #isContentEmpty() {
    return !this.#content;
  }

  async save(database) {
    if (this.#isContentEmpty()) {
      throw new Error("Memo content cannot be empty. Please enter some text.");
    }
    await database.add(this.content);
  }

  async fetchAll(database) {
    const rows = await database.getAll();
    if (!rows.length) {
      throw new Error(
        "No memos available. Use the app without options to add a new memo.",
      );
    }
    return rows.map(
      (row) => new MemoModel({ id: row.id, content: row.content }),
    );
  }

  async fetchById(database) {
    const row = await database.getById(this.id);
    this.content = row.content;
  }

  async delete(database) {
    await database.delete(this.id);
  }
}

export default MemoModel;
