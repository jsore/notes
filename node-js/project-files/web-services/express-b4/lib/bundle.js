/**
 * ./project-files/web-services/express-b4/lib/bundle.js
 *
 * API endpoints for managing book bundles
 */

'use strict';

const rp = require('request-promise');

module.exports = (app, es) => {
    const url = `http://${es.host}:${es.port}/${es.bundles_index}/bundle`;

    /**
     * resources using RESTful API via HTTP POST
     *   (because POST is better for creating a resource
     *   when we don't know the URL where that resource
     *   will reside)
     */


    /*----------  bundle create API  ----------*/

    // $ curl -X POST http://<host>:<port>/api/bundle?name=<name>

    app.post('/api/bundle', (req, res) => {
        /** inside Express callback function... */

        /**
         * bundle object, name property is provided string
         *   or empty string (this is an optional parameter),
         *   books property is initially empty list of books
         *   to be added to the bundle
         */
        const bundle = {
            name: req.query.name || '',
            books: [],
        };

    /**
     * give Elasticsearch a POST request consisting of bundle obj
     *   encoded in JSON, returning a settled Promise using 201
     *   code instead of 200
     */
    rp.post({url, body: bundle, json: true})
        .then(esResBody => res.status(201).json(esResBody))
        .catch(({error}) => res.status(error.status || 502).json(error));
    });


    /*----------  bundle retrieve API  ----------*/

    // $ curl http://<host>:<port>/api/bundle/<id>
    // $ curl -s localhost:60702/api/bundle/$BUNDLE_ID | jq '.'
    // bundle will be in '_source' of '_id'

    /**
     * set handler (async) for /bundle/:id route to retrieve
     *   a book bundle by its _id field
     */
    app.get('/api/bundle/:id', async (req, res) => {
        const options = {
            url: `${url}/${req.params.id}`,
            json: true,
        };
        /**
         * Elasticsearch request and response, use await to
         *    suspend async function until Promise settles
         */
        try {
            /**
             * if Promise resolves, return value of await
             *   expression and the HTTP code of 200 OK
             *
             * if Promise rejects, await throws rejection
             *   value as an exception to be caught and processed
             */
            const esResBody = await rp(options);
            res.status(200).json(esResBody);
        } catch (esResErr) {
            /**
             * rejection object (esResErr) contains multiple
             *   properties referencing failure reasons, use
             *   its .statusCode and .error props to close
             *   the Express response
             */
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    });


    /*----------  bundle name change API  ----------*/

    // $ curl -X PUT http://<host>:<port>/api/bundle/<id>/name/<name>
    // $ curl -s -X PUT localhost:60702/api/bundle/$BUNDLE_ID/name/foo | jq '.'
    // confirm change, use GET API to retrieve bundle:
    // $ curl -s localhost:60702/api/bundle/$BUNDLE_ID | jq '._source'

    app.put('/api/bundle/:id/name/:name', async (req, res) => {
        /** build appropriate url based on input */
        const bundleUrl = `${url}/${req.params.id}`;
        /**
         * Elasticsearch request and response
         */
        try {
            /**
             * bundle object is in _id._source, get just it
             *   from Elasticsearch's response with the
             *   async/await expression, store it here...
             */
            const bundle = (await rp({url: bundleUrl, json: true}))._source;
            /**
             * ...then overwrite the name properpty currently
             *   set with the value provided in url (:name)
             */
            bundle.name = req.params.name;
            /**
             * build Express response from Elasticsearch's
             *   response, PUT'ing the updated name property
             *   back into Elasticsearch through Express...
             */
            const esResBody = await rp.put({url: bundleUrl, body: bundle, json: true});
            res.status(200).json(esResBody);
        } catch (esResErr) {
            /**
             * ...or, catch Elasticsearch response error and
             *   send it back through Express's response instead
             */
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    });


    /*----------  adding book to bundle API  ----------*/

    // $ curl -X PUT http://<host>:<port>/api/bundle/<id>/book/<pgid>
    // add "The Art of War" to bundle:
    // $ curl -s -X PUT localhost:60702/api/bundle/$BUNDLE_ID/book/pg132 | jq '.'

    /** PUT's a book into a bundle by its array */
    app.put('/api/bundle/:id/book/:pgid', async (req, res) => {
        /**
         * build URL to bundle and grab it out of its index
         *
         * (pgid = Project Gutenberg ID)
         */
        const bundleUrl = `${url}/${req.params.id}`;

        /**
         * also need to access Elasticsearch index for book,
         *   grab book out of books index
         */
        const bookUrl =
            `http://${es.host}:${es.port}` +
            `/${es.books_index}/book/${req.params.pgid}`;
        //const bookUrl = 'http://localhost:9200/books/book/pg132';

        try {
            /**
             * demonstrating simultaneous requests, request
             *   bundle and book in parallel, each await'ed
             *   rp function inside an array of Promises, which
             *   returns a new Promise on all of them
             *
             * the .all method is resolved when all Promises in
             *   the array are resolved, which will end up holding
             *   the return values of each of those promises
             *
             * if any Promise(s) are rejected, Promise.all will
             *   reject and only the value of the first Promise
             *   in the array is retrieved
             */
            const [bundleRes, bookRes] = await Promise.all([
                rp({url: bundleUrl, json: true}),
                rp({url: bookUrl, json: true}),
            ]);

            /** extract bundle and book from responses */
            const {_source: bundle, _version: version} = bundleRes;
            const {_source: book} = bookRes;

            /**
             * use Array.findIndex to determine if book is
             *   already in the index, if not push it to the
             *   bundle.books array
             */
            const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
            if (idx === -1) {
                bundle.books.push({
                    id: req.params.pgid,
                    title: book.title,
                });
            }

            /**
             * build Express response from Elasticsearch's
             *   response, PUT the bundle updated with the
             *   book back into the index...
             *
             * use qs "query string" to tell Elasticsearch to
             *   attempt and match the query string parameter,
             *   if there's not a match, doc has changed,
             *   Elasticsearch sends back an HTTP 409 Conflict
             *   which causes await to throw exception
             */
            const esResBody = await rp.put({
                url: bundleUrl,
                qs: { version },
                body: bundle,
                json: true,
            });
            /**
             * if all is good, send 200 OK through Express's
             *   response and the JSON'ed Elasticsearch
             *   response body
             */
            res.status(200).json(esResBody);

        } catch (esResErr) {
            /**
             * ...or, catch Elasticsearch response error and
             *   send it back through Express's response instead
             */
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    });


    /*----------  delete a book from bundle API  ----------*/

    // $ curl -X DELETE http://<host>:<port>/api/bundle/<id>/book/<pgid>

    app.delete('/api/bundle/:id/book/:pgid', async (req, res) => {
        const bundleUrl = `${url}/${req.params.id}`;

        try {
            const {_source: bundle, _version: version} = await rp({url: bundleUrl, json: true});

            const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
            if (idx === -1) {
                throw {
                    statusCode: 409,
                    error: {
                        reason: 'Conflict - Bundle does not contain that book',
                    }
                };
            }

            bundle.books.splice(idx, 1);

            const esResBody = await rp.put({
                url: bundleUrl,
                qs: { version },
                body: bundle,
                json: true,
            });
            res.status(200).json(esResBody);
        } catch (esResErr) {
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    });


    /*----------  delete entire bundle API  ----------*/

    // $ curl -X DELETE http://<host>:<port>/api/bundle/<id>

    app.delete('/api/bundle/:id', async (req, res) => {
        const bundleUrl = `${url}/${req.params.id}`;
        try {
            const esResBody = await rp.delete({url: bundleUrl, json: true});
            res.status(200).json(esResBody);
        } catch (esResErr) {
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    });
};