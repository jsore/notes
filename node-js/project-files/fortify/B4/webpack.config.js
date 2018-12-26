/**
 * project-files/fortify/B4/webpack.config.js
 */

'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    /** dependency root source */
    entry: './app/index.ts',
    /** where webpack serves bundled package from */
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    /** which plugin handles what file(s) */
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader',
        },{
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },{
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000',
        }]
    },
    plugins: [
        /** HTML generator */
        new HtmlWebpackPlugin({
            title: 'Better Book Bundle Builder',
        }),
        /** for Bootstrap functionality */
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
    ],
};
