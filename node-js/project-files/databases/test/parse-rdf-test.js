/**
 * ../databases/test/parse-rdf-test.js
 *
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

    /** begin setting things up for Continuous Testing */
    it('should parse RDF content', () => {

        /** asserts "when parseRDF is called, get an obj back" */
        const book = parseRDF(rdf);
        expect(book).to.be.an('object');

        /** test for book id */
        expect(book).to.have.a.property('id', 132);

        /** test for book title */
        expect(book).to.have.a.property('title', 'The Art of War');

        /** test for array of book authors */
        expect(book).to.have.a.property('authors')
            .that.is.an('array').with.lengthOf(2)
            .and.contains('Sunzi, active 6th century B.C.')
            .and.contains('Giles, Lionel');

        /** test for array of authors */
        expect(book).to.have.a.property('subjects')
            .that.is.an('array').with.lengthOf(2)
            .and.contains('Military art and science -- Early works to 1800')
            .and.contains('War -- Early works to 1800');
    });
});
/**
 * until parseRDF is defined as a function, this test will fail
 */