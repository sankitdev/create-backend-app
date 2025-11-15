import { Command } from "commander";

const program = new Command();

program
  .name("create-backend-app")
  .description(
    "Scaffold a backend project in right way without breaking a sweat"
  )
  .version("0.1.0");

program.parse();
