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

    /** create new bundle with specified name */
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

};