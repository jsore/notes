/**
 * ../databases/lib/parse-rdf.js
 *
 * Library to define parseRDF function for RDF >> JSON conversion
 */
'use strict';

const cheerio = require('cheerio');

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
    /** parse the content passed at with `load` method */
    const $ = cheerio.load(rdf);

    /** place our content somewhere to be returned */
    const book = {};

    /** add some properties for book obj */

    /** "use Cheerio's API to extract book ID then format it..." */
    //book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');
    book.id =                     // set the ID property
        +                         // unary to cast final result as int
        $('pgterms\\:ebook')      // query for this tag, escaping JS literals and CSS selectors
        .attr('rdf:about')        // get value of this attribute
        .replace('ebooks/', '');  // strip off this substring

    /** "...and to extract book title" */
    book.title = $('dcterms\\:title').text();

    /** "...and to extract the book's authors" */
    book.authors = $('pgterms\\:agent pgterms\\:name')  // find child :name> under :agents>
        .toArray().map(elem => $(elem).text());         // convert to array of text strings

    /** "...and to extract the book's subject(s)" */
    book.subjects = $('[rdf\\:resource$="/LCSH"]')  // select tag with CSS attribute selector
        .parent().find('rdf\\:value')               // tell Cheerio to view parent then all of matching childs
        .toArray().map(elem => $(elem).text());     // convert to array of text strings

    return book;
};
