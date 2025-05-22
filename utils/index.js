import { dirname } from "path";
import { fileURLToPath } from "url";

import "dotenv/config";

export * from "./Auth.js";
export * from "./pluginName.js";
export * from "./copyRecursive.js";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
