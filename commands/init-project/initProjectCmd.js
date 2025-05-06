import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";
import { copyRecursive } from "../../utils/index.js";
import { useLogStep } from "../../composables/useLogStep.js";
import { handleExistingFolder } from "./handleExistingFolder.js";

export const initProjectCmd = async ({ templatesPath }) => {
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
    await handleExistingFolder(cwd, folderName);

  useLogStep(`Creating folder: ${safeFolderName}`);
  fs.mkdirSync(projectPath);

  useLogStep(`Copying template files (${selectedTemplate})...`);
  copyRecursive(path.join(templatesPath, selectedTemplate), projectPath);

  useLogStep(`Creating .prolibu config...`);
  fs.copyFileSync(
    path.join(__dirname, "../resources/.prolibu"),
    path.join(projectPath, ".prolibu")
  );

  fs.copyFileSync(
    path.join(__dirname, "../resources/shared", ".prolibu"),
    path.join(projectPath, ".prolibu")
  );

  if (usePrettier) {
    useLogStep("Setting up Prettier...");
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
    useLogStep("Copying .gitignore...");
    fs.copyFileSync(
      path.join(__dirname, "../resources/shared", ".gitignore"),
      path.join(projectPath, ".gitignore")
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
