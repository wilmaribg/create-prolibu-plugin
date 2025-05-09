import { exec } from "child_process";

/**
 * Ejecuta un archivo TypeScript usando ts-node.
 * @param {string} tsFilePath - Ruta al archivo .ts que deseas ejecutar.
 * @returns {Promise<string>} - Retorna la salida estándar del script ejecutado.
 */
export function runTsFile(tsFilePath) {
  return new Promise((resolve, reject) => {
    exec(`node ${tsFilePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❗ Error ejecutando el archivo: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.warn(`⚠️ Advertencias: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}
