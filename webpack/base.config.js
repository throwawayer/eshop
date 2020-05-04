const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { envObject, paths } = require('./vars');

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve('src', 'index.html'),
    favicon: path.resolve('src', 'assets', 'images', 'favicon.ico'),
  }),
  new webpack.EnvironmentPlugin({
    DEBUG: JSON.stringify(envObject.DEBUG),
    PRODUCTION: JSON.stringify(envObject.PRODUCTION),
  }),
];

if (envObject.DEBUG) {
  plugins.push(new CleanWebpackPlugin.CleanWebpackPlugin());
  plugins.push(
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: false,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
  );
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.LoaderOptionsPlugin({ debug: true }));
  plugins.push(new ForkTsCheckerWebpackPlugin());
} else {
  plugins.push(
    new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
    new webpack.HashedModuleIdsPlugin(),
  );
}

module.exports = {
  context: paths.root,
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  entry: ['babel-polyfill', paths.entry],
  output: {
    path: paths.output,
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: { cacheDirectory: true, babelrc: true },
          },
          { loader: 'ts-loader' },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf||svg|png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};
