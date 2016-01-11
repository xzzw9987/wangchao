var webpack = require('webpack');
module.exports = {
    entry: './js/app.js',
    output: {
        path: __dirname + '/build/',
        //filename: '[name].bundle.js',
        filename: 'bundle.js',

        /**
         * use hash
         * filename: [hash].bundle.js
         */

        /**
         * @important
         * publicPath
         * for code splitting
         */
        publicPath: './build/',
        chunkFilename: '[chunkhash].bundle.js'/*,
         library: 'mylib',
         libraryTarget: 'commonjs'*/
    },
    module: {
        loaders: [
            /* {
             test: /\.css$/,
             // ?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]
             loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
             },*/
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    stage: 0,
                    optional: ['runtime']
                }
            }]
    },
    resolve: {
        alias: {}
    },
    plugins: [
        /* new ExtractTextPlugin('app.css', {
         allChunks: true
         })*/
    ],
    externals: {
        "jquery": "jQuery"
    }
    //watch: true
    //devtool: 'source-map'
};