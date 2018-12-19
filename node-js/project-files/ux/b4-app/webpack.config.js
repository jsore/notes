/**
 * ./project-files/ux/b4-app/webpack.config.js
 *
 * config for webpack and webpack-dev-server
 */

'use strict';

/** pull in modules to resolve path to dist directory */
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');

/** grab our class from the module */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    /**
     * point at root of where all other dependencies can be
     *   sourced from
     */
    entry: './entry.js',

    /**
     * target directory (distDir) and its file where all our
     *   JS will be shunted into
     *
     * webpack would right content to this directory
     * webpack-dev-server however just serves content from mem
     */
    output: {
        filename: 'bundle.js',
        path: distDir,
    },

    /**
     * config parameters for webpack-dev-server, specifies root
     *   directory for content and overrides default TCP port
     */
    devServer: {
        contentBase: distDir,
        host: '10.0.3.15',
        port: 60800,
        //port: 8080,
        disableHostCheck: true,
        //host: '0.0.0.0',
        //hot: true,
        //open: true
    },

    /** bring in plugin for HTML generation */
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Better Book Bundle Builder',
        }),
    ],
};