import { Command } from "commander";
import { fileURLToPath } from "url";
import path from "path";
import { isCancel, cancel, text, select, intro, outro } from "@clack/prompts";
import { scaffold } from "../utils/scaffold.js";
import type { ORM, ProjectConfig } from "../types.js";

// import.meta.url is not available in ESM
// so we use fileURLToPath to get the absolute path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const program = new Command();

const ORM_CHOICES: ORM[] = ["mongoose", "prisma", "drizzle"];

program
  .name("create-backend-app")
  .description(
    "Scaffold a backend project in right way without breaking a sweat",
  )
  .version("0.2.0")
  .argument("[project-name]", "Name of the project directory")
  .option("--orm <orm>", `ORM to use (${ORM_CHOICES.join(", ")})`)
  .action(async (projectName, options) => {
    intro("create-backend-app");

    // 1. Ask for project name if not provided
    if (!projectName) {
      projectName = await text({
        message: "What is your project named?",
        placeholder: "my-backend-app",
        defaultValue: "my-backend-app",
      });

      if (isCancel(projectName)) {
        cancel("Operation cancelled.");
        process.exit(0);
      }
    }

    // 2. Ask for ORM if not provided via --orm flag
    let orm: ORM = options.orm;

    if (!orm) {
      const ormChoice = await select({
        message: "Which ORM would you like to use?",
        options: [
          {
            value: "mongoose",
            label: "Mongoose",
            hint: "MongoDB ODM — flexible, schema-based",
          },
          {
            value: "prisma",
            label: "Prisma",
            hint: "PostgreSQL — powerful, type-safe ORM",
          },
          {
            value: "drizzle",
            label: "Drizzle",
            hint: "PostgreSQL — lightweight, SQL-like TypeScript ORM",
          },
        ],
      });

      if (isCancel(ormChoice)) {
        cancel("Operation cancelled.");
        process.exit(0);
      }

      orm = ormChoice as ORM;
    }

    // Validate ORM choice
    if (!ORM_CHOICES.includes(orm)) {
      cancel(`Invalid ORM: "${orm}". Choose from: ${ORM_CHOICES.join(", ")}`);
      process.exit(1);
    }

    const config: ProjectConfig = {
      projectName,
      orm,
    };

    const templatesRoot = path.join(__dirname, "..", "..", "templates");

    await scaffold(config, templatesRoot);

    outro("Done! 🎉");
  });

program.parse();
