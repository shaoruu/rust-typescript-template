const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  mode: process.env.NODE_ENV || 'development',
  plugins: [new CopyWebpackPlugin({ patterns: ['index.html'] })],
};
