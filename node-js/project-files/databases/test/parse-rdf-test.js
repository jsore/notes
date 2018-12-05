/**
 * Unit test with Mocha + Chai module's `expect` test method
 *
 * Note: the content (file) we're testing has been copy/pasted
 *   into the same dir where this test file sits.
 *   From /databases/ directory:
 *       $ cp ../databases/data/cache/epub/132/pg132.rdf test/
 *       > "copy pg132.rdf into directory named test"
 */

'use strict';

const fs = require('fs');

/** use the expect method as the basis of all assertions */
const expect = require('chai').expect;

/** grab the anon func assigned to module.exports in our lib */
const parseRDF = require('../lib/parse-rdf.js');

/** load our content ('The Art of War') */
const rdf = fs.readFileSync(`${__dirname}/pg132.rdf`);

/** typical Mocha `describe` block... */
describe('parseRDF', () => {
    /** ...typical Mocha `it` block... */
    it('should be a function', () => {
        /** ...but, `it` uses Chai's `expect` */
        expect(parseRDF).to.be.a('function');
    });
});
/**
 * until parseRDF is defined as a function, this test will fail
 */