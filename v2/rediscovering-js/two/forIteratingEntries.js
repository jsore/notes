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


/**
 * or, to operate on the iterator returned with entries
 * instead of iterating over names[]
 *
 * each entry provided by entries iterator is desctructured
 * and placed into i and name, respectively
 */
for (const [i, name] of names.entries()) {
  /** this i is immutable */
  console.log(i + '--' + name);
}
// 0--Sara
// 1--Jake
// 2--Pete
// 3--Mark
// 4--Jill
