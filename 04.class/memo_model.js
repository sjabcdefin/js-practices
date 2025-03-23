class MemoModel {
  #id;
  #content;
  #firstLineOfContent;

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
    return this.#firstLineOfContent;
  }

  set id(id) {
    this.#id = id;
  }

  set content(content) {
    this.#content = content;
    this.#firstLineOfContent = content.split("\n")[0];
  }
}

export default MemoModel;
