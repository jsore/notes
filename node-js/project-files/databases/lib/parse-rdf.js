/**
 * ../databases/lib/parse-rdf.js
 *
 * Library to define parseRDF function
 */
'use strict';

/**
 *  v1 - assigning an anonymous function to module.exports,
 *    takes a single param (rdf) & returns nothing, but is
 *    still a function
 */
//module.exports = rdf => {
//};

/**
 * v2 - now our test expects an object to be returned when
 *   this function is called...
 */
module.exports = rdf => {
    const book = {};
    return book;
};
