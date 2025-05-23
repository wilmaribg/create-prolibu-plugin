import path from "path";
import webpack from "webpack";
import { fileURLToPath } from "url";
import WebpackDevServer from "webpack-dev-server";
import config from "../playground/webpack.config.js"; // or pass it as param

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runWebpackDevServer = async (webpackConfig = config) => {
  const compiler = webpack(webpackConfig);

  const devServerOptions = {
    hot: true,
    open: true,
    port: 4500,
    liveReload: true,
    host: "localhost",
    ...webpackConfig.devServer,
  };

  const devServer = new WebpackDevServer(compiler, devServerOptions);

  devServer.listen(
    devServerOptions.port,
    devServerOptions.host || "localhost",
    (err) => {
      if (err) {
        console.error("❌ Failed to start dev server:", err);
        process.exit(1);
      }
    }
  );

  console.log(
    `🚀 Dev server running at http://${devServerOptions.host}:${devServerOptions.port}`
  );
};
