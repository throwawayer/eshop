const merge = require('webpack-merge');
const baseConfig = require('./base.config');
const { paths } = require('./vars');

const config = {
  mode: `${process.env.NODE_ENV}`,
  devtool: 'source-map',
  devServer: {
    contentBase: paths.output,
    historyApiFallback: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(styl|css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
};

module.exports = merge(baseConfig, config);
