const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const baseConfig = require('./base.config');
const { paths } = require('./vars');

const config = {
  mode: `${process.env.NODE_ENV}`,
  devtool: 'source-map',
  devServer: {
    contentBase: paths.output,
    historyApiFallback: true,
    compress: true,
    port: 9000,
  },
  output: {
    filename: '[name].[hash].js',
  },
  optimization: {
    minimize: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin(),
      new TerserPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
    new webpack.HashedModuleIdsPlugin(),
  ],
};

module.exports = merge(baseConfig, config);
