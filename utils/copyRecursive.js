import fs from "fs";
import path from "path";

/**
 * Copia recursivamente todos los archivos y carpetas desde `src` a `dest`,
 * incluyendo archivos ocultos como `.prolibu`, `.gitignore`, etc.
 */
export const copyRecursive = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source path does not exist: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    // Asegura que se copien también archivos ocultos como .gitignore, .env, etc.
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    } else {
      // Si es un symlink u otro tipo de archivo no manejado
      console.warn(`⚠️ Skipping unsupported file type: ${srcPath}`);
    }
  }
};
