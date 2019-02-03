"use strict";
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require("./config/config.js").getProperties();

module.exports = {
  devtool: "cheap-eval-source-map",
  watch: true,
  watchOptions: {
    poll: true
  },
  mode: "development",
  entry: ["@babel/polyfill", path.join(__dirname, "src/index.js")],
  output: {
    path: path.join(__dirname, "/dist/"),
    filename: "[name].js",
    publicPath: "/"
  },
  resolve: {
    modules: [path.resolve("./src"), path.resolve("./node_modules")]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: ".eslintrc",
          failOnWarning: false,
          failOnError: false
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: "src/index.tpl.html",
      inject: "body",
      filename: "index.html"
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    new webpack.DefinePlugin({
      API_SERVER_URL: JSON.stringify(config.api_server_url)
    })
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
    dns: "empty"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: "pre",
        loader: "eslint-loader"
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.json?$/,
        loader: "json-loader"
      },
      {
        test: /(leaflet|leaflet\.draw).css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.css/,
        exclude: /(leaflet|leaflet\.draw).css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: "[local]___[hash:base64:5]",
              url: true,
              exportOnlyLocals: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        loader: "style-loader!css-loader!sass-loader"
      },
      {
        test: /\.woff(2)?(\?[a-z0-9#=&.]+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff-loader"
      },
      {
        test: /\.(gif|ttf|eot|svg|png)(\?[a-z0-9#=&.]+)?$/,
        use: ["file-loader", { loader: "image-webpack-loader" }]
      }
    ]
  }
};
