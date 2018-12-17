/**
 * ./project-files/web-services/express-b4/lib/search.js
 *
 * API endpoints for searching books index
 */

'use strict';

/** npm module, be sure to install first */
const request = require('request');

/**
 * export function that takes two parameters, app (the
 *   Express application object) and es (the returned
 *   config params provided to nconf for Elasticsearch)
 */
module.exports = (app, es) => {

    /** Elasticsearch URL to perform searches against index 'books' */
    const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;

    /*----------  /search/books API  ----------*/

    /**
     * endpoint for field-search API - search for
     *   books matching specified field value
     *
     * ex:   /api/search/books/authors/Twain
     */
    app.get('/api/search/books/:field/:query', (req, res) => {
        /**
         * the request body object containing JSON to
         *   send to Elasticsearch via Elasticsearch's
         *   Request Body Search API
         *
         * esReqBody.size param         limit number of returned docs
         * esReqBody.query obj          what docs we want to find
         * esReqBody.query.match obj    grab :field and :query params
         * req.params.field             :field, computed property name
         * req.params.query             :query
         */
        const esReqBody = {
            size: 10,
            query: {
                match: {
                    [req.params.field]: req.params.query
                }
            },
        };

        /**
         * send the request to Elasticsearch, and
         *   then handle responses
         *
         * req/res          Express request/response obj's
         * esReq/esRes      Elasticsearch request/response obj's
         * esResBody        response from Elasticsearch
         */
        const options = {url, json: true, body: esReqBody};
        request.get(options, (err, esRes, esResBody) => {
            /** inside the callback for request */

            /** handle error messages */
            if (err) {
                /**
                 * could the connection to the server not be
                 *   made at all (downed Elasticsearch cluster,
                 *   hostname misconfigured, no more file
                 *   descripters are available)? then:
                 *   err != null && esRes = null
                 */
                res.status(502).json({
                    error: 'bad_gateway',
                    reason: err.code,
                });
                return;
            }
            if (esRes.statusCode !== 200) {
                /**
                 * else err = null which means we will get
                 *   back a body to work with
                 *
                 * ex HTTP codes:
                 * - 404 Not Found:     "books index not created"
                 * - 400 Bad Request:   "bad esReqBody"
                 */
                res.status(esRes.statusCode).json(esResBody);
                return;
            }

            /**
             * fetch some JSON over HTTP, running _source objects
             *   through JSON parser via map(), telling the anon
             *   callback function to handle a destructuring
             *   assignemnt ( {itemToDestructure} )
             *
             * _source objects:     underlying docs from esRes
             */
            res.status(200).json(esResBody.hits.hits.map(({_source}) => _source));
        });
    });

    /**
     * Note: Usage
     *
     * with server.js running from a different terminal:
     *
     *      $ curl -s localhost:60702/api/search/books/authors/Shakespeare | jq '.[].title'
     *      > "Venus and Adonis"
     *      > "The Second Part of King Henry the Sixth"
     *      > "King Richard the Second"
     *      > "The Tragedy of Romeo and Juliet"
     *      > "A Midsummer Night's Dream"
     *      > "Much Ado about Nothing"
     *      > "The Tragedy of Julius Caesar"
     *      > "As You Like It"
     *      > "The Tragedy of Othello, Moor of Venice"
     *      > "The Tragedy of Macbeth"
     *
     *      $ curl -s localhost:60702/api/search/books/title/sawyer | jq '.[].title'
     *      > "Tom Sawyer Abroad"
     *      > "Tom Sawyer, Detective"
     *      > "Tom Sawyer Abroad"
     *      > "Tom Sawyer, Detective"
     *      > "The Adventures of Tom Sawyer"
     *      > "Tom Sawyer: Koulupojan historia"
     *      > "Tom Sawyer ilmailija\nHuckleberry Finn'in jatko"
     *      > "The Adventures of Tom Sawyer, Part 3."
     *      > "De Lotgevallen van Tom Sawyer"
     *      > "The Adventures of Tom Sawyer"
     */


    /*----------  /suggest API  ----------*/

    /**
     * collect suggested terms for a field based on a query,
     *   using Elasticsearch's Suggesters feature and
     *   its Suggest API and Request module
     *
     * if request succeeds, expect a JSON object in return
     *   from a :query string search in :field string
     *
     * ex:      /api/suggest/authors/lipman
     *         "do an 'authors' search for 'lipman'"
     *
     * :field   what we want suggestions for
     * :query   where to suggest from
     */
    app.get('/api/suggest/:field/:query', (req, res) => {
        /**
         * Elasticsearch request body and options to pass
         *   through 'request' module
         *
         * size: 0      don't match docs, just suggestions
         */
        const esReqBody = {
            size: 0,
            suggest: {
                suggestions: {
                    text: req.params.query,
                    term: {
                        field: req.params.field,
                        suggest_mode: 'always',
                    },
                }
            }
        };

        const options = {url, json: true, body: esReqBody};
        /** Promise creation */
        const promise = new Promise((resolve, reject) => {
            request.get(options, (err, esRes, esResBody) => {
                /** Elasticsearch cluster unreachable? */
                if (err) {
                    /** err not null */
                    reject({error: err});    // destructuring assignment
                    return;
                }
                /** malformed request? */
                if (esRes.statusCode !== 200) {
                    /** err is null & anything other than 200 */
                    reject({error: esResBody});    // destructuring assignment
                    return;
                }

                resolve(esResBody);
            });
        });
        /** Promise callbacks */
        promise
            /**
             * resolve Promise
             *
             * set Express response 200 and extract + serialize
             *   the .suggestion object returned from Elasticsearch
             */
            .then(esResBody => res.status(200).json(esResBody.suggest.suggestions))
            /**
             * reject Promise
             *
             * extract .error property on provided object via
             *   provided destructuring assignment at invocation
             */
            .catch(({error}) => res.status(error.status || 502).json(error));

        /**
         * NOTE - the following is a drop in replacement
         *   for codeblocks between
         *
         *      -----------------------
         *      const options = {url, json: true, body: esReqBody};
         *      ...
         *      .catch(({error}) => res.status(error.status || 502).json(error));
         *      -----------------------
         *
         * replacement:
         *
         *      -----------------------
         *      // $ npm isntall --save --save-exact request-promise@4.1.1
         *      ...
         *      const rp = require('request-promise');
         *      ...
         *      rp({url, json: true, body: esReqBody})
         *          .then(esResBody => res.status(200).json(esResBody.suggest.suggestions))
         *          .catch(({error}) => res.status(error.status || 502).json(error));
         *      -----------------------
         */

    /**
     * Note: Usage
     *
     *      // jq parses everything found, no special formatting
     *      $ curl -s localhost:60702/api/suggest/authors/lipman | jq '.'
     *      > [
     *      >   {
     *      >     "text": "lipman",
     *      >     "offset": 0,
     *      >     "length": 6,
     *      >     "options": [
     *      >       {
     *      >         "text": "lilian",
     *      >         "score": 0.6666666,
     *      >         "freq": 30
     *      >       },
     *      >       {
     *      >         "text": "lanman",
     *      >         "score": 0.6666666,
     *      >         "freq": 7
     *      >       },
     *      >       {
     *      >         "text": "lippmann",
     *      >         "score": 0.6666666,
     *      >         "freq": 6
     *      >       },
     *      >       {
     *      >         "text": "lampman",
     *      >         "score": 0.6666666,
     *      >         "freq": 3
     *      >       },
     *      >       {
     *      >         "text": "lehman",
     *      >         "score": 0.6666666,
     *      >         "freq": 3
     *      >       }
     *      >     ]
     *      >   }
     *      > ]
     *
     *      // jq parses everything found, formatted as text
     *      $ curl -s localhost:60702/api/suggest/authors/lipman | jq '.[].options[].text'
     *      > "lilian"
     *      > "lanman"
     *      > "lippmann"
     *      > "lampman"
     *      > "lehman"
     */
    });
};
