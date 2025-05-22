import fs from "fs";
import path from "path";
import inquirer from "inquirer";

export const handleExistingFolder = async (cwd, folderName) => {
  let finalFolderName = folderName;
  let projectPath = path.join(cwd, finalFolderName);

  while (fs.existsSync(projectPath)) {
    console.log(`⚠️ The folder "${finalFolderName}" already exists.`);

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "❌ Cancel", value: "cancel" },
          { name: "♻️  Overwrite the folder", value: "overwrite" },
          { name: "✏️  Enter a new folder name", value: "rename" },
        ],
      },
    ]);

    if (action === "cancel") {
      console.log("❌ Project creation canceled.");
      process.exit(0);
    }

    if (action === "overwrite") {
      fs.rmSync(projectPath, { recursive: true, force: true });
      console.log(`✅ Folder "${finalFolderName}" has been removed.`);
      break;
    }

    if (action === "rename") {
      const { newFolderName } = await inquirer.prompt([
        {
          type: "input",
          name: "newFolderName",
          message: "Enter a new folder name:",
          validate: (input) =>
            !!input && !fs.existsSync(path.join(cwd, input))
              ? true
              : "Folder name is required and must not exist",
        },
      ]);
      finalFolderName = newFolderName;
      projectPath = path.join(cwd, finalFolderName);
    }
  }

  return { folderName: finalFolderName, projectPath };
};
