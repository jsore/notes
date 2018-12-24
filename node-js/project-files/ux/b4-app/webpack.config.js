/**
 * ./project-files/ux/b4-app/webpack.config.js
 *
 * config for webpack and webpack-dev-server
 */

'use strict';

/** pull in modules to resolve path to dist directory */
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');
//__dirname + '/dist'       // ^^^ hardcode instead? ^^^
//const distDir = '/var/www/github_notes/notes/node-js/project-files/ux/b4-app/dist';

/** grab our class from the module */
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** for css */
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/** bring in webpack module for its plugin's namespace */
const webpack = require('webpack');

module.exports = {
    /**
     * point at root of where all other dependencies can be
     *   sourced from
     */
    ////
    //entry: './entry.js',
    ////
    /** use TypeScript instead */
    entry: './app/index.ts',

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
    ////
    //devServer: {
    //    contentBase: distDir,
    //    host: '10.0.3.15',
    //    port: 60800,
    //    //port: 8080,
    //    disableHostCheck: true,
    //    //host: '0.0.0.0',
    //    //hot: true,
    //    //open: true
    //},
    //devServer: {
    //    contentBase: distDir,
    //    host: '0.0.0.0',
    //    disableHostCheck: true,
    //    //port: 60800,
    //    //public: 'apachetestserver.com:80',
    //    useLocalIp: true,
    //},
    ////
    devServer: {
        contentBase: distDir,
        port: 60800,
        /** proxy for webpack-dev to reach out to API endpoints */
        proxy: {
            /** send requests to /api here */
            '/api': 'http://localhost:60702',
            /** send requests to /es here and fix URL */
            '/es': {
                target: 'http://localhost:9200',
                pathRewrite: {'^/es': ''},
            }
        },
    },

    /**
     * CSS plugins, "which file is handled by which plugins"
     *
     * Note: use: [] processes its arguments in reverse order
     *
     * ts-loader        use TypeScript for transpiling JS for
     *                  browser compatibility, front end code
     *                  now mmigrated from ./entry.js to new
     *                  TS file, ./app/templates.ts
     *
     * css-loader       reads CSS files, resolves @import, url()
     *                  statements using webpack's require()
     *
     * style-loader     handles what gets brought in from
     *                  css-loader, injects <style> tags
     *
     * url-loader       pull in remote files & inlines it, ex:
     *                  turns background image into data URI
     *
     * file-loader      package.json, where url-loader defers
     *                  handling to for files > limit=
     */
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader',
        },{
            test: /\.css$/,
            //use: ['style-loader', 'css-loader']
            use: ExtractTextPlugin.extract({
                use: 'css-loader',
                fallback: 'style-loader',
            }),
        },{
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000',
        }],
    },

    /** bring in plugin for HTML generation */
    plugins: [
        /** html generator */
        new HtmlWebpackPlugin({
            title: 'Better Book Bundle Builder',
        }),

        new ExtractTextPlugin('styles.css'),

        /** webpack's jquery for bootstrap */
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
    ]
};