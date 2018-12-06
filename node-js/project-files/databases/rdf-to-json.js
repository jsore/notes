/**
 * CLI program to explore other RDF files, using our
 *   custom made parse-rdf library and its -test.js
 *
 * Read rdf file contents, JSON parse it & print the JSON
 */

//#!/usr/bin/env node
const fs = require('fs');
const parseRDF = require('./lib/parse-rdf.js');
const rdf = fs.readFileSync(process.argv[2]);
const book = parseRDF(rdf);
console.log(JSON.stringify(book, null, ' '));