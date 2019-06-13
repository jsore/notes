# Newer JS Additions

Arrow functions, iterators, and generators to work with collections of objects

<br><br>



--------------------------------------------------------------------------------
### Destructuring, New `Symbol` Primitives, Updated `for`

An object that implements the `Symbol.iterator()` method can be used in `for..of`

```javascript
const names = ['Sara', 'Jake', 'Pete', 'Mark', 'Jill'];
/** .entries() returns an iterator */
for (const entry of names.entries()) {
  console.log(entry);
}
/** iterator holds keys and values */
// [ 0, 'Sara' ]
​// [ 1, 'Jake' ]
​// [ 2, 'Pete' ]
​// [ 3, 'Mark' ]
​// [ 4, 'Jill' ]

/** or, to operate  */
```
