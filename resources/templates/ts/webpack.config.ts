const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  resolve: {
    extensions: [".prtjs", ".prjsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|prtjs|prjsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
    open: true,
    hot: true,
  },
  mode: "development",
};
