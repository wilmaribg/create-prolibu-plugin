import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import { pluginName } from "../../../utils/index.js";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import EmbedCssToPrototypePlugin from "./EmbedCssToPrototypePlugin.js";

export default {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: `${pluginName()}.js`,
    library: {
      name: pluginName(),
      type: "umd",
      export: "default",
    },
    globalObject: "this",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.libraryName": JSON.stringify(pluginName()),
    }),
    new MiniCssExtractPlugin({ filename: `${pluginName()}.css` }),
    new EmbedCssToPrototypePlugin({ libraryName: pluginName() }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      // CSS de node_modules
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      // CSS de tu proyecto
      {
        test: /\.s[ac]ss$/,
        exclude: /node_modules/,
        include: path.resolve(process.cwd(), "src"),
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};
