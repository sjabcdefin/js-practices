class MemoModel {
  #id;
  #content;
  #title;

  constructor(id, content) {
    this.id = id;
    this.content = content;
    this.title = content;
  }

  get id() {
    return this.#id;
  }

  get content() {
    return this.#content;
  }

  get title() {
    return this.#title;
  }

  set id(memoId) {
    this.#id = memoId;
  }
  set content(memoContent) {
    this.#content = memoContent;
  }

  set title(memoContent) {
    this.#title = memoContent.split("\n")[0];
  }
}

export default MemoModel;
