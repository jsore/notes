/**
 * project-files/fortify/B4/server.js
 *
 * connects all the endpoints, modules, Express and middlewares
 */

'use strict';
const pkg = require('./package.json');
const {URL} = require('url');
const path = require('path');


/** nconf configuration */
const nconf = require('nconf');
nconf
    .argv()
    .env('__')
    .defaults({'NODE_ENV': 'development'});

/** are we in prod? */
const NODE_ENV = nconf.get('NODE_ENV');
const isDev = NODE_ENV === 'development';
nconf
    .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
    .file(nconf.get('conf'));

/** root URL built via Node core module 'url' */
const serviceUrl = new URL(nconf.get('serviceUrl'));
const servicePort =
    serviceUrl.port || (serviceUrl.protocol === 'https:' ? 443 : 80);


/** Express and middleware */
const express = require('express');
const morgan = require('morgan');

/** Express application reference */
const app = express();

/** Express session management middleware */
const expressSession = require('express-session');
if (isDev) {
    /** dev mode, use FileStore */

    /** setup of expressSession via FileStore class */
    const FileStore = require('session-file-store')(expressSession);
    app.use(expressSession({

        /** save session on each request? */
        resave: fales,

        /**
         * save new but unmodified sessions?
         *
         * set to false in prod for user agent race conditions
         *   and obtaining user permission for cookie usage
         *
         * set to true in dev for inspection of all session data
         */
        saveUninitialized: true,

        /** sign cookie vals, but pull from nconf in prod */
        secret: 'unguessable',
        store: new FileStore(),
    }));
} else {
    /** prod mode, use RedisStore */
}

app.use(morgan('dev'));

app.get('/api/version', (req, res) => res.status(200).json(pkg.version));

/** serve webpack assets */
if (isDev) {
    /** development env */

    const webpack = require('webpack');

    /** serve assets from memory via Express */
    const webpackMiddleware = require('webpack-dev-middleware');

    const webpackConfig = require('./webpack.config.js');
    app.use(webpackMiddleware(webpack(webpackConfig), {
        publicPath: '/',
        stats: {colors: true},
    }));
} else {
    /** production env */
    app.use(express.static('dist'));
}

app.listen(servicePort, () => console.log('Ready...'));
