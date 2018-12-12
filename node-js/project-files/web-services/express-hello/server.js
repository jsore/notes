/**
 * ./web-services/express-hello/server.js
 *
 * Small example of Express usage - Hello World app
 *
 * Synonymous with 'http' version in parent dir, ./web-services/server.js
 */

'use strict';

/** after installing npm modules, bring them in */
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.get('/hello/:name', (req, res) => {
    res.status(200).json({'hello': req.params.name});
});

app.listen(60701, () => console.log('Ready'));