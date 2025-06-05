import pkg from "webpack-sources";
const { ConcatSource } = pkg;

export default class EmbedCssToPrototypePlugin {
  constructor(options = {}) {
    this.libraryName = options.libraryName || "myLib";
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "EmbedCssToPrototypePlugin",
      (compilation, callback) => {
        const cssFiles = Object.keys(compilation.assets).filter((filename) =>
          filename.endsWith(".css")
        );

        let combinedCss = "";

        cssFiles.forEach((file) => {
          combinedCss += compilation.assets[file].source();
          // ✅ Eliminar el archivo CSS final del output
          delete compilation.assets[file];
        });

        const escapedCss = JSON.stringify(combinedCss);

        const jsFiles = Object.keys(compilation.assets).filter((filename) =>
          filename.endsWith(".js")
        );

        jsFiles.forEach((file) => {
          const originalSource = compilation.assets[file];
          const appendedSource = new ConcatSource(
            originalSource,
            `\n\n// Embed styles to prototype\n`,
            `${this.libraryName}.styles = ${escapedCss};\n`
          );
          compilation.assets[file] = appendedSource;
        });

        callback();
      }
    );
  }
}
