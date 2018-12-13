/**
 * ./project-files/web-services/express-b4/server.js
 *
 * Main entry point for B4 app
 */

'use strict';

/** begin npm modules with Express... */
const express = require('express');
/** ...HTTP logging util... */
const morgan = require('morgan');
/** ...connection settings... */
const nconf = require('nconf');
/** ...hooking into our package file for references to app version */
const pkg = require('./package.json');

/**  */
nconf.argv().env('__');
nconf.defaults({conf: `${__dirname}/config.json`});
nconf.file(nconf.get('conf'));

/** build app context (object) for us via Express */
const app = express();

/** specify middleware for request/response objects */
app.use(morgan('dev'));

/**
 * what will Express do with HTTP GET requests when API endpoint
 *   '/api/version' is hit (ex: $ curl -s "http://localhost:60702/api/version")
 */
app.get('/api/version', (req, res) => res.status(200).send(pkg.version));

/** log when listening on port :60702 as sepcified in config.json */
app.listen(nconf.get('port'), () => console.log('Ready...'));

/**
 * Note: Usage
 *
 *  // terminal 1
 *  $ npm start
 *  > express-b4@1.0.0 start /var/www/github_notes/notes/node-js/project-files/web-services/express-b4
 *  > node server.js
 *  >
 *  > Ready...
 *
 *  // terminal 2
 *  $ curl -s "http://localhost:60702/api/version"
 *  > 1.0.0
 *
 *  // back to terminal 1
 *  > Ready...
 *  > GET /api/version 200 8.298 ms -5
 */