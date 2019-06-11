/**
 * rediscovering-js/one/isPrime.js
 *
 * basic 'use strict' declaration example
 */

'use strict';

/** declare new i variable each time */
const isPrime = function (n) {
  // 'Math.sqrt(n)'  and  '< n'  interchangeable
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return n > 1;
};

const sumOfPrimes = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    if (isPrime(i)) sum += i;
  }
  return sum;
};

console.log(sumOfPrimes(10));
