const path = require("path");
module.exports = {
  entry: {
    router: "./src/router.ts",
    index: "./src/index.ts",
  },
  output: {
    assetModuleFilename: "images/[hash][ext][query]",
  },
  devServer: {
    static: [path.resolve(__dirname, "src")],
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
