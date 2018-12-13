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
};

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