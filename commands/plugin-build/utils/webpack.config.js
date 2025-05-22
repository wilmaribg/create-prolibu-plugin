import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import { pluginName } from "../../../utils/index.js";
import insertStylesFunction from "./insertStylesFunction.js";

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
      {
        test: /\.(css|scss)$/i,
        exclude: /node_modules/,
        include: path.resolve(process.cwd(), "src"),
        use: [
          {
            loader: "style-loader",
            options: {
              insert: insertStylesFunction,
            },
          },
          {
            loader: "css-loader",
          },
          "sass-loader",
        ],
      },
    ],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  optimization: {
    minimize: false,
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
