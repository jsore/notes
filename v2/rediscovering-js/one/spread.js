'use strict';

/**
 * without Rest
 */
const nums1 = ['one', 'two', 'three'];
const nums2 = ['four'];
const spit = function(num1, num2) {
  console.log('spit ' + num1 + ' and' + num2);
};

/** three gets ignored as an extra param */
spit(...nums1);  // spit one and two

/** second parameter defaults to undefined */
spit(...nums2);  // spit four and undefined



/**
 * mixed with Rest
 */
const mixed = function(name1, name2, ...names) {
  console.log('name1: ' + name1);
  console.log('name2: ' + name2);
  console.log('names: ' + names);
};
mixed('Tom', ...['Jerry', 'Billy', 'Bob', 'Buck']);
// name1: Tom             <-- 1st named param
// name2: Jerry           <-- 2nd named param
// names: Billy,Bob,Buck  <-- the Rest



/**
 * with a constructor
 */
const patternAndFlags = ['r', 'i'];
const regExp = new RegExp(...patternAndFlags);



/**
 * arry copying, concat'ing, manipulating
 */
const names1 = ['Tom', 'Jerry'];
const names2 = ['Billy', 'Bob', 'Buck'];

/** create new array of names1 + additional value */
console.log([...names1, 'Brooke']);
/** new array with names1 and names2 concat'ed */
console.log([...names1, ...names2]);
/** new array with additional arbitrary value */
console.log([...names2, ​'Meathead'​, ...names1]);

// [ 'Tom', 'Jerry', 'Brooke' ]
// [ 'Tom', 'Jerry', 'Billy', 'Bob', 'Buck' ]
// [ 'Billy', 'Bob', 'Buck', 'Meathead', 'Tom', 'Jerry', ]



/**
 * copy objects and with changes to immutable props
 */
const sam = { name: 'Sam', age: 2 };
/** original */
console.log(sam);
/** copy with prop change */
console.log({...sam, age: 3});
/** copy with prop change and addition */
console.log({...sam, age: 4, height: 100});
/** still haven't modified the original */
console.log(sam);

// { name: 'Sam', age: 2 }
// { name: 'Sam', age: 3 }
// { name: 'Sam', age: 4, height: 100 }
// { name: 'Sam', age: 2 }
