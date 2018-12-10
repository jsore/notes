/**
 * ./program-files/esclu/index.js
 *
 * Runs when esclu executable is called, for interacting with the
 *   Elasticsearch RESTful API for JSON doc storage over HTTP
 */

'use strict';

/** Node modules */
const fs = require('fs');

/** npm modules */
const request = require('request');
const program = require('commander');

/** custom modules/files */
/** reference config paramaters from JSON file */
const pkg = require('./package.json');


/**
 * ----------  Program help  ----------
 *
 * '$ ./esclu'
 *
 *  Usage: esclu [options] <command> [...]
 *
 *
 *  Commands:
 *
 *    url [path]            generate the URL for the options and path (default is /)
 *    get [path]            perform an HTTP GET request for path (default is /)
 *    create-index          create an index
 *    list-indices|li       get a list of indices in this cluster
 *    bulk <file>           read and perform bulk options from the specified file
 *    query|q [queries...]  perform an Elasticsearch query
 *
 *  Elasticsearch Command Line Utility
 *
 *  Options:
 *
 *    -h, --help             output usage information
 *    -V, --version          output the version number
 *    -o, --host <hostname>  hostname [localhost]
 *    -p, --port <number>    port number [9200]
 *    -j, --json             format output as JSON
 *    -i, --index <name>     which index to use
 *    -t, --type <type>      default type for bulk operations
 *    -f, --filter <filter>  source filter for query results
 */


/*----------  URL creation  ----------*/
const fullUrl = (path = '') => {
    /** takes `path` and return URL to Elasticsearch based on params */
    let url = `http://${program.host}:${program.port}/`;
    if (program.index) {
        url += program.index + '/';
        if (program.type) {
            url += program.type + '/';
        }
    }
    /** strip off any leading / provided by user */
    return url + path.replace(/^\/*/, '');
};


/*----------  Commander CL program creation  ----------*/
program
    .version(pkg.version)
    .description(pkg.description)
    .usage('[options] <command> [...]')
    .option('-o, --host <hostname>', 'hostname [localhost]', 'localhost')
    .option('-p, --port <number>', 'port number [9200]', '9200')
    .option('-j, --json', 'format output as JSON')
    .option('-i, --index <name>', 'which index to use')
    .option('-t, --type <type>', 'default type for bulk operations')
    .option('-f, --filter <filter>', 'source filter for query results');


/*----------  Command - log URL to console  ----------*/
program
    /** command name, paramaters */
    .command('url [path]')
    /** command description */
    .description('generate the URL for the options and path (default is /)')
    /** callback to invoke */
    .action((path = '/') => console.log(fullUrl(path)));


/*----------  Command - GET resource (URL and requested JSON file)  ----------*/
program
    .command('get [path]')
    .description('perform an HTTP GET request for path (default is /)')
    /**
     * Note: Usage
     *
     *      // use this command and _search API for querying items
     *      $ ./esclu get '_search' | jq '.' | head -n 20
     *      // query string syntax to search for specific items
     *      $ ./esclu get '_search?q=authors:Twain' | jq '.' | head -n 30
     *      // query string while omitting items in _source object
     *      $ ./esclu get '_search?q=authors:Twain&_source=title' | jq '.' | head -n 30
     */
    .action((path ='/') => {
        /** what request module is looking for */
        const options = {
            url: fullUrl(path),
            /** boolean, if true attach to HTTP header that we want JSON response */
            json: program.json,
        };
        /** using request module, execute HTTP request and call callback */
        request(options, (err, res, body) => {
            /** inside the callback... */
            if (program.json) {
                console.log(JSON.stringify(err || body));
            } else {
                if (err) throw err;
                console.log(body);
            }
        });
    });


/*----------  Command - PUT (create) Elasticsearch index  ----------*/
/** wrap our request command into a reausable function */
const handleResponse = (err, res, body) => {
    if (program.json) {
        console.log(JSON.stringify(err || body));
    } else {
        if (err) throw err;
        console.log(body);
    }
};
/** since we know the full URL, use PUT instead of POST */
program
    .command('create-index')
    .description('create an index')
    .action(() => {
        /** if didn't user specify an index with --index... */
        if (!program.index) {
            const msg = 'No index specified, use --index <name>';
            /** and if the --json flag is set... */
            if (!program.json) throw Error(msg);
            /** ...if no flag, just throw the error */
            console.log(JSON.stringify({error: msg}));
            return;
        }
        /** if everything's valid, use request.put it issue HTTP PUT */
        request.put(fullUrl(), handleResponse);

        /**
         * Can be verified an index was added with:
         *
         *     $ ./esclu get '_cat/indices?v'
         */
    });


/*----------  Command - easy list Elasticsearch indices  ----------*/
program
    .command('list-indices')
    .alias('li')
    .description('get a list of indices in this cluster')
    .action(() => {
        /** determine request path, _all if --json otherwise _cat/indices?v */
        const path = program.json ? '_all' : '_cat/indices?v';
        request({url: fullUrl(path), json: program.json}, handleResponse);
    });


/*----------  Command - bulk add file tool  ----------*/
/** don't neccesarily know full URL, so POST instead of PUT */
program
    .command('bulk <file>')
    .description('read and perform bulk options from the specified file')
    /**
     * Note: Usage
     *
     *     // build the file
     *     $ ./esclu bulk actual_bulk_result.json -i books -t book > actual_bulk_result_2.json
     *     // see some content
     *     $ cat actual_bulk_result_2.json | jq '.' | head -n 20
     *     // how many operations there were
     *     $ cat actual_bulk_result_2.json | jq '.items | length'
     *     // use list-indices to check how many docs the books index has
     *     $ ./esclu li
     */
    .action(file => {
        /** asynch-ly check on existing and reachable file */
        fs.stat(file, (err, stats) => {
            if (err) {
                if (program.json) {
                    console.log(JSON.stringify(err));
                    return;
                }
                throw err;
            }
            const options = {
                /** use Elasticsearch's _bulk API */
                url: fullUrl('_bulk'),
                /** _bulk expects JSON, so make sure data is formatted */
                json: true,
                headers: {
                    'content-length': stats.size,
                    'content-type': 'application/json',
                }
            };
            /** store returned object from HTTP POST request to Elasticsearch here */
            const req = request.post(options);
            /** open a read stream to the file... */
            const stream = fs.createReadStream(file);
            /** ...pipe the stream into our request... */
            stream.pipe(req);
            /** ...and upon server response, pipe output of request object to console */
            req.pipe(process.stdout);
        });
    });


/*----------  Command - query Elasticsearch  ----------*/
program
    /** tell Commander to accept any number of queries, even 0 */
    .command('query [queries...]')
    .alias('q')
    .description('perform an Elasticsearch query')
    /**
     * Note: Usage
     *
     *      // basic search, an empty search to match all items
     *      $ ./esclu q | jq '.' | head -n 30
     *      // more advanced
     *      $ ./esclu q authors:Twain AND subjsects:children
     *      // with a filter
     *      $ ./esclu​​ ​​q​​ ​​-f​​ ​​title,authors​​ ​​|​​ ​​jq​​ ​​'.'​​ ​​|​​ ​​head​​ ​​-n​​ ​​30​
     *      // using .join for complex queries
     *      $ ./esclu q authors:Shakespeare AND subjects:Drama -f title | jq '.hits.hits[],_source.title'
     */
    .action((queries = []) => {
        const options = {
            url: fullUrl('_search'),
            json: program.json,
            qs: {},
        };
        /** build URL for options.qs object */
        if (queries && queries.length) {
            /** concat any provided params with spaces */
            options.qs.q = queries.join(' ');
            /**
             * ex:
             * $ esclu -q "Mark" "Twain"
             * - q param is "Mark Twain"
             * - request encodes as ?q=Mark%20Twain
             */
        }
        if (program.filter) {
            /** also make request encode any filters if provided */
            options.qs_source = program.filter;
            /**
             * ex:
             * $ esclu -q "Mark" "Twain" -f title
             * request encoded: ?q=Mark%20Twain&_source=title
             */
        }
        request(options, handleResponse);
    });


/** what commander evaluates */
program.parse(process.argv);


/** does our program have any objects in args array built by commander? */
if (!program.args.filter(arg => typeof arg === 'object').length) {
    /** if theres anything that commander doesn't recognize... */
    program.help();
}
