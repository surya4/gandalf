const path = require('path');

const DIST_DIR = path.resolve(__dirname, "dist");
const SRC_DIR = path.resolve(__dirname, "src");

const config = {
  entry: SRC_DIR + "/index.js",
  output: {
      path: DIST_DIR + "/app",
      filename: "bundle.js",
      publicPath: "/app/"
  },
  module: {
    rules: [
          {
              test: /\.(js|jsx)$/,
              include: SRC_DIR,
              loader: "babel-loader",
              query: {
                  presets: ['@babel/preset-react']
              }
          }
      ]
  }
};

module.exports = config;