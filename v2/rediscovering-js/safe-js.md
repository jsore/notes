# Safe JS

Going back to the book cause of reasons.

This is anything I've found worthy of drilling home regarding JS basics.

<br><br>



--------------------------------------------------------------------------------
### Type Coercion

```javascript
=   // type and value coercion
==  // str int boo type coercion
=== // no coercion, strict
```

<br><br>



--------------------------------------------------------------------------------
### Strict Mode

- Scope the `use strict` directive basically only when refactoring old code
  + start with bottom-most scope, work your way up to broader reaches
- No undeclared variables leaking into global scope
- Watches for changes and deletions on read-only properties
- Disallows use of keywords that may be implemented in the near future
- Module files automatically run code in strict mode at runtime

<br>


__All excerpts in these notes are in `strict` mode__

<br><br>



--------------------------------------------------------------------------------
### Suggested ESLinting Rules

```
$ npm install -g eslint
$ npx eslint --init
```

Declarations within `.eslintrc.json`
```
module.exports = {
​    "env": {
​        "es6": true,
​        "node": true
​    },
​    "extends": "eslint:recommended",
​    "rules": {
​        "eqeqeq": "error",
​        "strict": "error",
​        "no-var": "error",
​        "prefer-const": "error",
​        "no-console": "off",
​        "indent": [
​            "error",
​            2
​        ],
​        "linebreak-style": [
​            "error",
​            "unix"
​        ],
​        "quotes": [
​            "error",
​            "single",
​            "avoid-escape"
​        ],
​        "semi": [
​            "error",
​            "always"
​        ]
​    }
​};
```

<br><br>



--------------------------------------------------------------------------------
### Mutability

`var` allows for hoisting to top of scope + global and redefinitions ( overwrites )

<br>


`let` disallows hoisting and redifining, block scoped

<br>


`const` protects primitives and references, __not__ the object being referenced

  ```javascript
  const sam = { first: 'Sam', age: 2 };
  sam = { first: 'Sam', age: 3 };  // Error, direct object reference redifinition
  // also disallows even mentioning original props:
  sam = { first: 'Sam', age: 2 };  // Error, direct object reference

  // assuming no strict
  sam.age = 3;  // Allowed, sam is a handle to obj with this unprotected prop

  // assume strict mode and new script
  'use strict';
  // force immutability
  const same = Object.freeze({ first: 'Sam', age: 2 });
  sam.age = 3;  // TypeError: Cannot assign to read only property
  ```

<br><br>



--------------------------------------------------------------------------------
### Parameters, Arguments

Stop using `arguments[0]` faux-Array for parsing function paramets, use __Rest__

- has to be last formal parameter
- can only be a single rest parameter in function param list
- must contain only un-named values
    ```javascript
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
    ```

<br>

__Spread__ is basically the opposite, used in function calls to break up
collections

- in place of Rest
    ```javascript
    const nums1 = ['one', 'two', 'three'];
    const nums2 = ['four'];
    const spit = function(num1, num2) {
      console.log('spit ' + num1 + ' and' + num2);
    };

    /** three gets ignored as an extra param */
    spit(...nums1);  // spit one and two

    /** second parameter defaults to undefined */
    spit(...nums2);  // spit four and undefined
    ```

- used with Rest
    ```javascript
    const mixed = function(name1, name2, ...names) {
      console.log('name1: ' + name1);
      console.log('name2: ' + name2);
      console.log('names: ' + names);
    };
    mixed('Tom', ...['Jerry', 'Billy', 'Bob', 'Buck']);
    // name1: Tom             <-- 1st named param
    // name2: Jerry           <-- 2nd named param
    // names: Billy,Bob,Buck  <-- the Rest
    ```


- used with Constructors
    ```javascript
    const patternAndFlags = ['r', 'i'];
    const regExp = new RegExp(...patternAndFlags);
    ```

- spread into a copy, concat'ed or manipulated array
    ```javascript
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
    ```

- spread an object and optionally manipulate props
    ```javascript
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
    ```
