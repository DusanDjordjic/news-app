/**
 * @description
 * Evo sta se desava u kodu kada na onDestroy pozovemo unsubscribe
 * posto smo pre toga pozvali notify, a u njemu zapoceli forEach niz kroz koji
 * prolazi forEach postaje isti sve dok se ne zavrsi.
 * Tako da ako mi nasem nizu dodelimo novi niz bez nekog elementa do kog se jos nije doslo u forEach,
 * taj element ce biti izbacen iz niza ali ce forEach i dalje da prodje kroz njega
 *
 * Ako nizu dodelimo novi niz (na primer sa filter) onda ce forEach i dalje da prolazi kroz sve elemente
 * pa cak i te koje smo izbacili.
 *
 * Ako koristimo pop() pravilno ce ga izbaciti.
 */
let arr = [1, 2, 3];
arr.forEach((item) => {
  if (item == 1) {
    // arr = arr.filter((i) => i !== 3);
    arr.pop();
  }
  // arr.push(item + 3);
  console.log(item);
});
console.log(arr);

// Moguce resenje

// let arr = [1, 2, 3];
// arr.forEach((item) => {
//   if (item == 1) {
//     arr = arr.filter((i) => i !== 3);
//   }
//   if (arr.includes(item)) console.log(item);
// });
// console.log(arr);
