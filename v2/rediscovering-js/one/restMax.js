'use strict';

// Rest = 'Rest of the parameters'
const max = function (...values) {
  // values is now a placeholder of any number of arguments
  console.log(values instanceof Array);  // true
  let large = values[0];
  for (let i = 0; i < values.length; i++) {
    if (values[i] > large) {
      large = values[i];
    }
  }
  return large;
};
console.log(max(2, 1, 7, 4));  // 7

// or, a more functional approach
const max = function (...values) {
  return values.reduce((large, e) => large > e ? large : e, values[0]);
};
