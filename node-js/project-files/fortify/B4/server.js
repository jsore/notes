/**
 * project-files/fortify/B4/server.js
 *
 * connects all the endpoints
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

const NODE_ENV = nconf.get('NODE_ENV');
const isDev = NODE_ENV === 'development';
nconf
    .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
    .file(nconf.get('conf'));

const serviceUrl = new URL(nconf.get('serviceUrl'));
const servicePort =
    serviceUrl.port || (serviceUrl.protocol === 'https:' ? 443 : 80);


/** Express and middleware */
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.get('/api/version', (req, res) => res.status(200).json(pkg.version));

/** serve webpack assets */
if (isDev) {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackConfig = require('./webpack.config.js');
    app.use(webpackMiddleware(webpack(webpackConfig), {
        publicPath: '/',
        stats: {colors: true},
    }));
} else {
    app.use(express.static('dist'));
}

app.listen(servicePort, () => console.log('Ready...'));
