import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import copy from "recursive-copy";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { useLogStep } from "../../composables/useLogStep.js";
import { handleExistingFolder } from "./extras/handleExistingFolder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COPY_OPTS = { overwrite: true, expand: true, dot: true };
const sharedDir = path.join(__dirname, "../../resources/shared");

export const pluginInitProjectCmd = async ({ templatesPath }) => {
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
      choices: ["TypeScript", "JavaScript"],
      default: "TypeScript",
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

  const selectedTemplate = language === "TypeScript" ? "ts" : "js";

  const { folderName: safeFolderName, projectPath } =
    await handleExistingFolder(process.cwd(), folderName);

  useLogStep(`Creating folder: ${safeFolderName}`);
  fs.mkdirSync(projectPath);

  useLogStep(`Copying template files (${selectedTemplate})...`);
  await copy(
    path.join(templatesPath, selectedTemplate),
    projectPath,
    COPY_OPTS
  );

  useLogStep(`Creating .prolibu config...`);
  await copy(
    path.join(sharedDir, ".prolibu"),
    path.join(projectPath, ".prolibu"),
    COPY_OPTS
  );

  if (usePrettier) {
    useLogStep("Setting up Prettier...");
    await copy(
      path.join(sharedDir, ".prettierrc"),
      path.join(projectPath, ".prettierrc"),
      COPY_OPTS
    );
    await copy(
      path.join(sharedDir, ".prettierignore"),
      path.join(projectPath, ".prettierignore"),
      COPY_OPTS
    );
  }

  if (initGit) {
    useLogStep("Copying .gitignore...");
    await copy(
      path.join(sharedDir, ".gitignore"),
      path.join(projectPath, ".gitignore"),
      COPY_OPTS
    );

    useLogStep("Initializing Git repository...");
    execSync("git init", { cwd: projectPath, stdio: "inherit" });
    execSync("git add .", { cwd: projectPath, stdio: "inherit" });
    execSync('git commit -m "Initial commit"', {
      cwd: projectPath,
      stdio: "inherit",
    });
  }

  if (installDependencies) {
    useLogStep(`Installing dependencies using ${packageManager}...`);
    execSync(`${packageManager} install`, {
      cwd: projectPath,
      stdio: "inherit",
    });
  } else {
    useLogStep(
      "Skipping dependency installation. You can run it manually later."
    );
  }

  useLogStep(`Project "${safeFolderName}" created successfully! 🚀`);
  console.log(`\n➡ Run the following to get started:\n`);
  console.log(`  cd ${safeFolderName}`);
  console.log(`  npm start\n`);
};
