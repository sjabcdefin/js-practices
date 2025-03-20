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

  set id(memoId) {
    this.#id = memoId;
  }
  set content(memoContent) {
    this.#content = memoContent;
  }
}

export default MemoModel;
