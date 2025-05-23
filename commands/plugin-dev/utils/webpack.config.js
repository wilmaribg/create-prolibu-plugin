import path from "path";
import webpack from "webpack";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: path.resolve(__dirname, "../playground/index.tsx"), // cambia a tsx si usas TSX
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist-playground"),
    filename: "bundle.js",
    clean: true,
  },
  devtool: "cheap-module-source-map",

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@plugin": path.resolve(__dirname, "../playground/src"),
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "defaults" }],
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../playground/index.html"),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
