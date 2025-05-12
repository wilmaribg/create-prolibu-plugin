import { runWebpack } from "./utils/runWebpack.js";
import webpackConfig from "./utils/webpack.config.js";

export const pluginBuildCmd = async () => {
  console.log(
    "roge webpackConfig ---->",
    JSON.stringify(webpackConfig, null, 2)
  );
  await runWebpack(webpackConfig);
  console.log("Build completed successfully.");
};
