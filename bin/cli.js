#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { initProjectCmd } from "../commands/index.js";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
const cwd = process.cwd();
const prolibuConfigPath = path.join(cwd, ".prolibu");
const templatesPath = path.join(__dirname, "../resources/templates");

// Verificar si ya está inicializado
const isProjectInitialized = fs.existsSync(prolibuConfigPath);

// Logs tipo paso a paso
function logStep(message) {
  console.log(`🛠️  ${message}`);
}

// Lógica principal
if (!isProjectInitialized) {
  initProjectCmd();
} else {
  const { componentName } = await inquirer.prompt([
    {
      type: "input",
      name: "componentName",
      message: "Enter the name of the component:",
      validate: (input) => !!input || "Component name is required",
    },
  ]);

  logStep(`Creating component: ${componentName}`);
  // Aquí podrías ejecutar tu lógica para crear el componente
}
