import { Command } from "commander";
import { scaffold } from "../utils/scaffold.js";

const program = new Command();

program
  .name("create-backend-app")
  .description(
    "Scaffold a backend project in right way without breaking a sweat"
  )
  .version("0.1.0")
  .argument("[project-name]", "Name of the project directory", ".")
  .action(async (projectName) => {
    await scaffold(projectName);
  });

program.parse();
