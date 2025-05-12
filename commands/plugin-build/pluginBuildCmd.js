import { runWebpack } from "./utils/runWebpack.js";
import webpackConfig from "./utils/webpack.config.js";

export const pluginBuildCmd = async () => {
  await runWebpack(webpackConfig);
  console.log("Build completed successfully.");
};
