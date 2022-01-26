export class Observer<T> {
  callback: Function;

  constructor(callback: Function) {
    this.callback = callback;
  }

  update(value: T) {
    this.callback(value);
  }
}
