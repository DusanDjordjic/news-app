import { Observer } from "./observer";
/**
 * @description
 * Observable koji sadrzi niz observera
 * kojima treba da javi kada se desi promena
 * sa "subscribe" se dodaje observer
 * notify javlja svim subscribe-ovanim observerima koja je poslednja vrednost
 * notifyOne javlja samo jednom observeru koja je poslajenja vrednos
 * sa setValue se postavlja nova vrednost i poziva se notify
 */
export class Observable<T> {
  observers: Observer<T>[] = [];
  value: T;

  constructor(firstValue: T) {
    this.value = firstValue;
  }

  subscribe(observer: Observer<T>) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer<T>) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  setValue(newValue: T) {
    this.value = newValue;
    return this.notify();
  }

  notify() {
    this.observers.forEach((obs) => obs.update(this.value));
  }

  notifyOne(observer: Observer<T>) {
    observer.update(this.value);
  }
}
