class Memo {
  #database;
  #id;
  #content;

  constructor(memoDB, id = null, content = "") {
    this.#database = memoDB;
    this.#id = id;
    this.#content = content;
  }

  get id() {
    return this.#id;
  }

  get content() {
    return this.#content;
  }

  set content(memoContent) {
    this.#content = memoContent;
  }

  #isContentEmpty() {
    return !this.#content;
  }

  async save() {
    if (this.#isContentEmpty())
      throw new Error("Memo content cannot be empty. Please enter some text.");
    await this.#database.add(this.content);
  }

  async fetchAll() {
    const rows = await this.#database.getAll();
    if (!rows.length)
      throw new Error(
        "No memos available. Use the app without options to add a new memo.",
      );
    return rows.map((row) => new Memo(this.#database, row.id, row.content));
  }

  async fetchById() {
    const row = await this.#database.getById(this.id);
    this.content = row.content;
  }

  async delete() {
    await this.#database.delete(this.id);
  }
}

export default Memo;
