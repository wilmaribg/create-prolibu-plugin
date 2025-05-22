import webpack from "webpack";

export const runWebpack = (webpackConfig) => {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err.toString());
      } else {
        console.log(
          stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
          })
        );
        resolve();
      }
    });
  });
};
