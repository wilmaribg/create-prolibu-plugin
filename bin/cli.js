#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { Command } from "commander";
import {
  pluginBuildCmd,
  pluginInitProjectCmd,
  pluginPublishCmd,
  prolibuLoginCmd,
} from "../commands/index.js";
import { pluginDevCmd } from "../commands/plugin-dev/pluginDevCmd.js";

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
  .command("plugin")
  .description("Commands for working with plugins")
  .addCommand(
    new Command("publish").description("Publish the plugin").action(() => {
      logStep("Publishing plugin...");
      pluginPublishCmd({ templatesPath });
    })
  )
  .addCommand(
    new Command("build").description("Build the plugin").action(() => {
      logStep("Building plugin...");
      pluginBuildCmd();
    })
  )
  .addCommand(
    new Command("dev")
      .description("Run the plugin in development mode")
      .action(() => {
        logStep("Starting plugin in dev mode...");
        pluginDevCmd();
      })
  );

program.parse(process.argv);
