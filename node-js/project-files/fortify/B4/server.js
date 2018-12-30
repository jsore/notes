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
/** Facebook */
passport.serializeUser((profile, done) => done(null, {
    id: profile.id,
    provider: profile.provider,
}));

/** Local */
//passport.serializeUser(function(user, done) {
//    done(null, user.id);
//});
//passport.serializeUser((profile, done) => done(null, {
//    username: profile.username,
//    password: profile.password,
//}));


/**
 * user object >> ident token
 *
 * send our identified user object straight to done(), no
 *   need to hit a DB for ident lookup
 */
/** Facebook */
passport.deserializeUser((user, done) => done(null, user));

/** Local */
//passport.deserializeUser(function(id, done) {
//    User.findById(id, function(err, user) {
//        done(err, user);
//    });
//});



/** order is important here... */
app.use(passport.initialize());
/** ...use the user session thats within the Express session */
app.use(passport.session());



/*----------  Facebook strategy  ----------*/

/**
 * Note - this only works over HTTPS
 */

const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    /** inside 1st .use argument... */

    clientID: nconf.get('auth:facebook:appID'),
    clientSecret: nconf.get('auth:facebook:appSecret'),
    /** create FQDN with serviceUrl as the base */
    callbackURL: new URL('/auth/facebook/callback', serviceUrl).href,

    /**
     * about to progress to 2nd arg, a user-resolving callback...
     *
     * we're not storing user data, so profile is all we need,
     *   no DB connection/retrieval needed, using the profile
     *   object from serializeUser above
     */
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

/** Express route - sign in */
app.get('/auth/facebook', passport.authenticate('facebook'));
/** Express route - user authed/authed failure */
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/',
}));


/*----------  Google strategy  ----------*/

const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
    clientID: nconf.get('auth:google:clientID'),
    clientSecret: nconf.get('auth:google:clientSecret'),
    callbackURL: new URL('/auth/google/callback', serviceUrl).href,
    /** google-specific param requirement */
    scope: 'https://www.googleapis.com/auth/plus.login',
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

/** Express routes for Google */
app.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']}));
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
}));


/*----------  local strategy  ----------*/
//
// my attempt
//
//const LocalStrategy = require('passport-local').Strategy;
//passport.use(new LocalStrategy({
//    //const username = nconf.get('auth:local:username');
//    //const password = nconf.get('auth:local:password');
//    username: nconf.get('auth:local:username'),
//    password: nconf.get('auth:local:password'),
//    function(username, password, done) {
//
//        User.findOne({ username: username }, function(err, user) {
//            if (err) { return done(err); }
//            if (!user) {
//                return done(null, false, { message: 'Incorrect username' });
//            }
//            if (!user.validPassword(password)) {
//                return done(null, false, { message: 'Incorrect password' });
//            }
//            return done(null, user);
//        });
//    }
//}, (user, done) => done(null, user)));
////app.post('/auth/local', console.log(`${username} ${password}`); );
//app.post('/auth/local', passport.authenticate('local', {
//    successRedirect: '/',
//    failureRedirect: '/',
//    //failureFlash: true
//}));
//
// doc specification
//
const LocalStrategy = require('passport-local').Strategy;
//const username = nconf.get('auth:local:username');
//const password = nconf.get('auth:local:password');
//const username = 'demonstration';
//const password = 123456;
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: 'demonstration' }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'bad username' });
            }
            if (!user.validPassword('password')) {
                return done(null, false, { message: 'bad password' });
            }
            return done(null, user);
        });
    }
));
//app.post('/auth/local', passport.authenticate('local', {
//    successRedirect: '/',
//    failureRedirect: '/',
//}));
//app.post((req, res) => {
//    const session = {auth: true};
//    res.status(200).json(session);
//});


/** other middleware, basic 'service up?' checker */
app.use(morgan('dev'));
app.get('/api/version', (req, res) => res.status(200).json(pkg.version));


/*----------  serve webpack assets  ----------*/

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


    // yeah this is borked, try again later
    const session = {auth: req.isAuthenticated()};
    //const session = {auth: true};


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
