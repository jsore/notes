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


/*----------  Express  ----------*/

const express = require('express');
/** log HTTP messages */
const morgan = require('morgan');

/** Express application reference */
const app = express();


/*----------  Express - session management middleware  ----------*/

const expressSession = require('express-session');
if (isDev) {
    /** dev mode, use FileStore */

    /** setup of expressSession via FileStore class */
    const FileStore = require('session-file-store')(expressSession);
    app.use(expressSession({

        /** save session on each request? */
        resave: false,

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

        /**
         * session data storage, extends the express-session's
         *   module Store class
         *
         * default config options are fine, go ahead and store
         *   session info in ./sessions
         */
        store: new FileStore(),
    }));
} else {
    /** prod mode, use RedisStore */
}


/*----------  Express - Passport auth middleware  ----------*/

const passport = require('passport');

/**
 * ident token >> user object
 *
 * read Passport User Profile object with minimum possible
 *   data to identify a user
 *
 * we're not storing user login data in a DB, so instead of
 *   hitting a DB to grab a user ident string, query for
 *   the ID the login service provides
 */
passport.serializeUser((profile, done) => done(null, {
    id: profile.id,
    provider: profile.provider,
}));

/**
 * user object >> ident token
 *
 * send our identified user object straight to done(), no
 *   need to hit a DB for ident lookup
 */
passport.deserializeUser((user, done) => done(null, user));

/** order is important here... */
app.use(passport.initialize());
/** ...use the user session thats within the Express session */
app.use(passport.session());



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


/*----------  Express session route  ----------*/

/**
 * check response with
 *
 *      $ curl -s b4.example.com:60900/api/session
 *
 * returns session object, use ./index.ts to display
 */
app.get('/api/session', (req, res) => {
    /**
     * use Passport's isAuthenticated(), which Passport adds
     *   to the Express request object req
     */
    const session = {auth: req.isAuthenticated()};
    /** /api/session returns obj with auth prop, JSON it */
    res.status(200).json(session);
});


/*----------  Express signout route  ----------*/

app.get('/auth/signout', (req, res) => {
    /** access Passport-added Express.req object logout() */
    req.logout();
    res.redirect('/');
});


app.listen(servicePort, () => console.log('Ready...'));
