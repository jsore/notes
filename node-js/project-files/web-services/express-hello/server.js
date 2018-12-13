/**
 * ./web-services/express-hello/server.js
 *
 * Small example of Express usage - Hello World app to demonstrate REST/JSON
 *
 * Synonymous with 'http' version in parent dir, ./web-services/server.js
 */

'use strict';

/** after installing npm modules, bring them in */
const express = require('express');
const morgan = require('morgan');

/**
 * the Express module is itself a function, call and store it here
 *   using an extremely strong convention - naming the call 'app'
 *
 * when this is called, Express builds an application context for you
 */
const app = express();

/**
 * app.use specifies the 'middleware' we want to use for manipulating
 *   any response and request objects sent through here - here we're
 *   using the 'morgan' middleware set to 'dev' mode to log all
 *   incoming reuests to the console
 */
app.use(morgan('dev'));

/**
 * app.get specifies how Express is to handle HTTP GET requests to
 *   the /hello/:name path, ':name' being a named route parameter
 */
app.get('/hello/:name', (req, res) => {
    /** inside method for single HTTP request method, GET */

    /** send object, as JSON, with 'hello' key set to ':name' */
    res.status(200).json({'hello': req.params.name});
});

/** logs when ready to receive & listen for incoming requests */
app.listen(60701, () => console.log('Ready...'));

/**
 * Note: Usage
 *
 *      // terminal 1
 *      $ node server.js
 *      > Ready...
 *
 *      // terminal 2, with server.js running
 *      $ curl -i localhost:60701/hello/jimbo    # -i: HTTP headers + response body
 *      > HTTP/1.1 200 OK                        # response code
 *      > X-Powered-By: Express                  # begin remaining HTTP headers...
 *      > Content-Type: application/json; charset=utf-8
 *      > Content-Length: 17
 *      > ETag: W/"11-vrDYB0Rw9smBgTMv0r99rA"
 *      > Date: Thu, 13 Dec 2018 00:22:01 GMT
 *      > Connection: keep-alive                 # ...end HTTP headers
 *      >
 *      > {"hello":"jimbo"}                      # response body
 *                                               # can use -s for just body
 *
 *      // terminal 1, through Morgan after the curl request
 *      > Ready...
 *      > GET /hello/jimbo 200 41.371 ms - 17
 */