var path = require('path');
var webpack = require('webpack');

var name = 'qart';
var plugins = [], outputFile;
var env = process.env.WEBPACK_ENV;
var target = 'umd';

if (env === 'build') {
	plugins.push(new webpack.optimize.UglifyJsPlugin({
	    compress: {
	        warnings: false
        }
    }));
	outputFile = name + '.min.js';
} else {
	outputFile = name + '.js';
}

module.exports = {
	entry: {
		qart: './src/qart.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: outputFile,
		library: name,
    	libraryTarget: target,
		publicPath: '../dist/'
	},
	module: {
		loaders: [
	        {
	            test: /\.js$/,
	            loader: 'babel',
	            exclude: /node_modules/,
	            query: {
	                cacheDirectory: true,
	                presets: ['es2015']
	            },
	            include: [
	                path.resolve(__dirname, '../')
	            ]
	        }
		],
	},
	plugins: plugins,
	devtool: 'cheap-module-source-map',
	devServer: {
		overlay: true
	}
}
