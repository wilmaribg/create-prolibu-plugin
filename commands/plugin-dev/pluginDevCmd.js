import { runWebpackDevServer } from "./utils/runWebpackDevServer.js";
import webpackConfig from "./playground/webpack.config.js";

export const pluginDevCmd = async () => {
  await runWebpackDevServer(webpackConfig);
  console.log("Build completed successfully.");
};
