import { Command } from "commander";
import { fileURLToPath } from "url";
import path from "path";
import { scaffold } from "../utils/scaffold.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const program = new Command();

program
  .name("create-backend-app")
  .description(
    "Scaffold a backend project in right way without breaking a sweat"
  )
  .version("0.1.0")
  .argument("[project-name]", "Name of the project directory", ".")
  .action(async (projectName) => {
    const templateDir = path.join(
      __dirname,
      "..",
      "..",
      "templates",
      "express"
    );
    await scaffold(projectName, templateDir);
  });

program.parse();
