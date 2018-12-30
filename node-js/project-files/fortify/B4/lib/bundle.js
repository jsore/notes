/**
 * project-files/fortify/B4/lib/bundle.js
 *
 * houses Router for book bundles
 */

'use strict';
const express = require('express');
const rp = require('request-promise');

/**
 * helper function for obtaining auth'ed user's user key,
 *   pulling out user.provider, user.id properties from
 *   the user object that Passport sticks onto Express'
 *   Request object (req)
 */
const getUserKey = ({user:{provider, id}}) => `${provider}-${id}`;

module.exports = es => {
    /** pull in webpack settings */
    const url = 'http://${es.host}:${es.port}/${es.bundles_index}/bundle';
    const router = express.Router();


    /*----------  auth check middleware for Router  ----------*/

    router.use((req, res, next) => {
        /**
         * review req object's isAuthenticated method() that
         *   gets added by Passport, throw a 403 Forbidden if
         *   user is not auth'ed
         */
        if (!req.isAuthenticated()) {
            res.status(403).json({
                error: 'You must sign in to use this service',
            });
            return;
        }
        next();
    });


    /*----------  Route to list bundles  ----------*/

    /**
     * bundle grabber for auth'ed user, via Express call to
     *   the Elasticsearch DB
     */
    router.get('/list-bundles', async (req, res) => {
        try {
            /** build Elasticsearch request body */
            const esReqBody = {
                size: 1000,
                query: {
                    match: {
                        /** make the request user-specific */
                        userKey: getUserKey(req),
                    }
                },
            };

            /** options for request */
            const options = {
                url: `${url}/_search`,
                json: true,
                body: esReqBody,
            };

            /** get Elasticsearch response body as new Promise... */
            const esResBody = await rp(options);
            const bundles = esResBody.hits.hits.map(hit => ({
                id: hit._id,
                name: hit._source.name,
            }));
            res.status(200).json(bundles);

            /** ...or fail gracefully */
        } catch (err) {
            res.status(err.statusCode || 502).json(err.error || err);
        }
    });


    /*----------  Route for new bundle create  ----------*/

    router.post('/bundle', async (req, res) => {
        try {
            const bundle = {
                name: req.query.name || '',
                userKey: getUserKey(req),
                books: [],
            };

            const esResBody = await rp.post({url, body: bundle, json: true});
            res.status(201).json(esResBody);
        } catch (err) {
            res.status(err.statusCode || 502).json(err.error || err);
        }
    });


    /*----------  Route for getting a single bundle  ----------*/

    router.get('/bundle/:id', async (req, res) => {
        try {
            const options = {
                url: `${url}/${req.params.id}`,
                json: true,
            };

            const {_source: bundle} = await rp(options);

            if (bundle.userKey !== getUserKey(req)) {
                throw {
                    /**
                     * material isn't super sensitive, throw a
                     *   403 Forbidden instead of 404 Not Found
                     */
                    statusCode: 403,
                    error: 'You are not authorized to view this bundle',
                };
            }

            res.status(200).json({id: req.params.id, bundle});
        } catch (err) {
            res.status(err.statusCode || 502).json(err.error || err);
        }
    });

    /** throw our Router back to caller */
    return router;
};