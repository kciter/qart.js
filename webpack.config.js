var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: {
		qart: './src/qart.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].min.js',
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
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
	],
	devtool: 'inline-source-map'
}
