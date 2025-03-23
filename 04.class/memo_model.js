class MemoModel {
  #id;
  #content;

  constructor(id, content) {
    this.id = id;
    this.content = content;
  }

  get id() {
    return this.#id;
  }

  get content() {
    return this.#content;
  }

  get firstLineOfContent() {
    return this.#content.split("\n")[0];
  }

  set id(id) {
    this.#id = id;
  }

  set content(content) {
    this.#content = content;
  }
}

export default MemoModel;
