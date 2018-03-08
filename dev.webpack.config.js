const webpack = require('webpack');

const config = require("./base.webpack.config.js")

config.devServer = {
  contentBase: './build',
  hot: true,
  inline: true,
  historyApiFallback: true,
};

config.entry.app.unshift('react-hot-loader/patch');

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
);

config.devtool = 'source-map';

module.exports = config;