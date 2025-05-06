#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

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

// Copiar recursivamente los archivos de plantilla
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Lógica principal
if (!isProjectInitialized) {
  const {
    folderName,
    language,
    usePrettier,
    initGit,
    packageManager,
    installDependencies,
  } = await inquirer.prompt([
    {
      type: "input",
      name: "folderName",
      message: "Enter the name of the new plugin folder:",
      validate: (input) => !!input || "Folder name is required",
    },
    {
      type: "list",
      name: "language",
      message: "Select the language for your new project:",
      choices: ["JavaScript", "TypeScript"],
    },
    {
      type: "confirm",
      name: "usePrettier",
      message: "Do you want to use Prettier as a code formatter?",
      default: true,
    },
    {
      type: "confirm",
      name: "initGit",
      message: "Do you want to initialize a Git repository?",
      default: true,
    },
    {
      type: "list",
      name: "packageManager",
      message: "Which package manager do you want to use?",
      choices: ["npm", "yarn"],
      default: "npm",
    },
    {
      type: "confirm",
      name: "installDependencies",
      message: "Do you want to install project dependencies now?",
      default: true,
    },
  ]);

  const projectPath = path.join(cwd, folderName);
  const selectedTemplate = language === "TypeScript" ? "ts" : "js";

  if (fs.existsSync(projectPath)) {
    console.error(`❌ Folder "${folderName}" already exists.`);
    process.exit(1);
  }

  logStep(`Creating folder: ${folderName}`);
  fs.mkdirSync(projectPath);

  logStep(`Copying template files (${selectedTemplate})...`);
  copyRecursive(path.join(templatesPath, selectedTemplate), projectPath);

  logStep(`Creating .prolibu config...`);
  fs.copyFileSync(
    path.join(__dirname, "../resources/.prolibu"),
    path.join(projectPath, ".prolibu")
  );

  fs.copyFileSync(
    path.join(__dirname, "../resources/shared", ".prolibu"),
    path.join(projectPath, ".prolibu")
  );

  if (usePrettier) {
    logStep("Setting up Prettier...");
    fs.copyFileSync(
      path.join(__dirname, "../resources/shared", ".prettierrc"),
      path.join(projectPath, ".prettierrc")
    );
    fs.copyFileSync(
      path.join(__dirname, "../resources/shared", ".prettierignore"),
      path.join(projectPath, ".prettierignore")
    );
  }

  if (initGit) {
    logStep("Copying .gitignore...");
    fs.copyFileSync(
      path.join(__dirname, "../resources/shared", ".gitignore"),
      path.join(projectPath, ".gitignore")
    );

    logStep("Initializing Git repository...");
    execSync("git init", { cwd: projectPath, stdio: "inherit" });
    execSync("git add .", { cwd: projectPath, stdio: "inherit" });
    execSync('git commit -m "Initial commit"', {
      cwd: projectPath,
      stdio: "inherit",
    });
  }

  if (installDependencies) {
    logStep(`Installing dependencies using ${packageManager}...`);
    execSync(`${packageManager} install`, {
      cwd: projectPath,
      stdio: "inherit",
    });
  } else {
    logStep("Skipping dependency installation. You can run it manually later.");
  }

  logStep(`Project "${folderName}" created successfully! 🚀`);
  console.log(`\n➡ Run the following to get started:\n`);
  console.log(`  cd ${folderName}`);
  console.log(`  npm start\n`);
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
