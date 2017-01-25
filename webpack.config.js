var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: {
		qart: './src/qart.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].bundle.js',
		publicPath: '../dist/'
	},
	module: {
		// preLoaders: [
		// 	{
		// 		test: /\.js$/,
		// 		loader: 'eslint',
		// 		exclude: /node_modules/
		// 	}
		// ],
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
	// eslint: {
	// 	formatter: require('eslint-friendly-formatter')
	// },
	devtool: 'inline-source-map'
}
