import fs from "fs";
import path from "path";
import { publisherService } from "../../http-services/publisherService.js";
import { createFileFromPath } from "./utils/createFileFromPath.js";
import { cleanString } from "./utils/cleanString.js";

export const pluginPublishCmd = async (options) => {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  const filePath = path.resolve(process.cwd(), "dist", "prolibu-plugin.js");
  const iconDirPath = path.resolve(process.cwd(), "src", "assets");

  if (!fs.existsSync(filePath)) {
    console.error(
      "❗ The file does not exist at the specified path:",
      filePath
    );
    return;
  }

  if (!fs.existsSync(packageJsonPath)) {
    console.error(
      "❗ The package.json file does not exist at:",
      packageJsonPath
    );
    return;
  }

  // Leer y parsear el package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  // Buscar cualquier archivo de imagen (png, jpg, jpeg, svg, etc.) en la carpeta assets
  const imageExtensions = [".png", ".jpg", ".jpeg", ".svg", ".gif", ".bmp"];
  const iconFiles = fs
    .readdirSync(iconDirPath)
    .filter((file) =>
      imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))
    );

  if (iconFiles.length === 0) {
    console.error("❗ No image file found in the assets directory.");
    return;
  }

  const iconPath = path.resolve(iconDirPath, iconFiles[0]); // Usar el primer archivo de imagen encontrado

  // Convertir los archivos a objetos File
  const iconFile = createFileFromPath(iconPath, iconFiles[0]);
  const pluginFile = createFileFromPath(filePath, "prolibu-plugin.js");

  try {
    const pluginExists = await publisherService.checkIfExists({
      url: "/v2/plugin/search",
      params: { searchTerm: packageJson.name, term: packageJson.name },
    });

    let _id = null;
    if (pluginExists) _id = pluginExists?.data?.[0]?._id;

    // Subir los archivos (plugin y la imagen)
    const response = await publisherService.upload(
      {
        active: true,
        icon: iconFile,
        resources: pluginFile,
        pluginName: cleanString(packageJson.name),
        version: cleanString(packageJson.version),
        description: cleanString(packageJson.description),
      },
      { _id }
    );
    console.log("✅ File uploaded successfully:", response);
  } catch (error) {
    console.error("❗ Error uploading file:", error);
  }
};
