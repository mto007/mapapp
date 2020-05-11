var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDevelopment = process.env.NODE_ENV === "development";
const Dotenv = require("dotenv-webpack");
module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.bundle.js",
  },
  node: {
    fs: "empty",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.module\.s(a|c)ss$/,
        loader: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: isDevelopment,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        loader: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".scss"],
  },
  devServer: {
    contentBase: path.resolve(__dirname, "build"), // Where your static files are, ie: index.html
    watchContentBase: true, // Enable live-reloading
    compress: true, // no real significance here
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      hash: true,
    }),
    new Dotenv(),
    new MiniCssExtractPlugin(),
  ],
  stats: {
    colors: true,
  },
  devtool: "source-map",
};
