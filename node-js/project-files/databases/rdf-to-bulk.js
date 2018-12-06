/**
 * ./databases/rdf-to-bulk.js
 *
 * Finds all RDF files in a directory and passes the file's
 *   content through our `parse-rdf.js` library
 */
'use strict';

/** a new npm module */
const dir = require('node-dir');
/** our libgrary */
const parseRDF = require('./lib/parse-rdf.js');

//const dirname = process.argv[2];
const args = process.argv[2];
const dirname = `/var/www/github_notes/notes/node-js/project-files/databases/${args}`;
console.log(dirname);

const options = {
    match: /\.rdf$/,        // match files ending in 'rdf'
    exclude: ['pg0.rdf'],   // ignores the rdf template file
};

dir.readFiles(dirname, options, (err, content, next) => {
    if (err) throw err;
    process.stdout.on('error', err => {
        //console.log(err);
        //process.exit();
        if (err.code === 'EPIPE') {
            console.log(err.code);
            process.exit();
        }
        throw err;
    });

    const doc = parseRDF(content);
    console.log(JSON.stringify({ index: { _id: `pg${doc.id}`} }));
    console.log(JSON.stringify(doc));
    //console.log(doc.id);
    next();
});

/**
 * to run this and capture all rdf files in a dir then output to file:
 *
 * $ node rdf-to-bulk.js data/cache/epub > /var/www/github_notes/notes/node-js/project-files/databases/data/bulk_pg.ldj
 */