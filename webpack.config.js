const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const name = "qart";

module.exports = {
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       cache: true,
  //       parallel: true,
  //       uglifyOptions: {
  //         compress: false,
  //         ecma: 6,
  //         mangle: true
  //       },
  //       sourceMap: true
  //     })
  //   ]
  // },
  entry: {
    qart: "./src/qart.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: "qart.js",
    library: name,
    libraryTarget: "umd",
    publicPath: "../dist/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
        include: [path.resolve(__dirname, "/src")]
      }
    ]
  },
  devtool: "cheap-module-source-map",
  devServer: {
    overlay: true
  },
  mode: process.env.WEBPACK_ENV
};
