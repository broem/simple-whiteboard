const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
var nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: ["./client/main.js"], // Change the entry point to main.js
  mode: "development",
  output: {
    path: __dirname,
    filename: "./public/bundle.js",
  },
  target: "node",
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve("node_modules/socket.io-client/dist/socket.io.js"),
          to: path.resolve(__dirname, "public"),
        },
      ],
    }),
  ],
  externals: nodeExternals(),
};