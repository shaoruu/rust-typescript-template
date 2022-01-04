const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
  },
  mode: process.env.NODE_ENV || "development",
  plugins: [new CopyWebpackPlugin({ patterns: ["index.html"] })],
};
