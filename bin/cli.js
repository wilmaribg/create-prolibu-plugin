#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { pluginInitProjectCmd } from "../commands/index.js";
import { pluginPublishCmd } from "../commands/plugin-publish/pluginPublishCmd.js";
import { prolibuLoginCmd } from "../commands/prolibu-login/prolibuLoginCmd.js";

const program = new Command();

// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const cwd = process.cwd();
const prolibuConfigPath = path.join(cwd, ".prolibu");
const templatesPath = path.join(__dirname, "../resources/templates");

// Step-by-step log
function logStep(message) {
  console.log(`🛠️  ${message}`);
}

// CLI Commands
program
  .name("prolibu")
  .description("CLI to initialize and manage Prolibu projects")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize a new project")
  .action(() => {
    if (!fs.existsSync(prolibuConfigPath)) {
      pluginInitProjectCmd({ templatesPath });
    } else {
      console.log(
        "❗ A .prolibu configuration already exists in this project."
      );
    }
  });

program
  .command("create-component")
  .description("Create a new component inside the project")
  .action(async () => {
    const { componentName } = await inquirer.prompt([
      {
        type: "input",
        name: "componentName",
        message: "Enter the component name:",
        validate: (input) => !!input || "Component name is required",
      },
    ]);
    logStep(`Creating component: ${componentName}`);
    // Add component creation logic here
  });

program
  .command("login")
  .description("Log in to Prolibu")
  .action(() => {
    prolibuLoginCmd();
  });

program
  .command("publish")
  .description("Publish the component or project")
  .action(() => {
    logStep("Publishing...");
    pluginPublishCmd({ templatesPath });
  });

program.parse(process.argv);
