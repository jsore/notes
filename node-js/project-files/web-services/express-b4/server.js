/**
 * ./project-files/web-services/express-b4/server.js
 *
 * Main entry point for B4 Express app
 */

'use strict';

/*----------  npm modules, cusom modules  ----------*/
/** big dog... */
const express = require('express');
/** ...HTTP logging util... */
const morgan = require('morgan');
/** ...connection & Elasticsearch settings */
const nconf = require('nconf');

/** hook into our package file for references to app version */
const pkg = require('./package.json');

/*----------  nconf config settings  ----------*/
nconf.argv().env('__');
nconf.defaults({conf: `${__dirname}/config.json`});
nconf.file(nconf.get('conf'));

/** build app context (object) for us via Express */
const app = express();

/** specify middleware for request/response objects */
app.use(morgan('dev'));

/*----------  GET requests  ----------*/
/**
 * what will Express do with HTTP GET requests when API endpoint
 *   '/api/version' is hit (ex: $ curl -s "http://localhost:60702/api/version")
 */
app.get('/api/version', (req, res) => res.status(200).send(pkg.version));

/**
 * bring in search module, passing app object and nconf.get()
 *
 * nconf will return all settings from es section which gets
 *   stored in 2nd function paramater
 */
require('./lib/search.js')(app, nconf.get('es'));

/** bring in bundle management API */
require('./lib/bundle.js')(app, nconf.get('es'));

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