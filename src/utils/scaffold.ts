import path from "path";
import fs from "fs-extra";
import type { ProjectConfig } from "../types.js";

// Patterns to exclude when copying templates
const EXCLUDE_PATTERNS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".env",
  ".DS_Store",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "package.partial.json",
];

/**
 * Copy a template directory to the target path, excluding common patterns
 */
async function copyTemplate(sourceDir: string, targetPath: string) {
  const exists = await fs.pathExists(sourceDir);
  if (!exists) return;

  await fs.copy(sourceDir, targetPath, {
    overwrite: true,
    errorOnExist: false,
    filter: (src) => {
      const relativePath = path.relative(sourceDir, src);

      const shouldExclude = EXCLUDE_PATTERNS.some((pattern) => {
        const parts = relativePath.split(path.sep);
        return parts.includes(pattern) || relativePath === pattern;
      });

      if (shouldExclude) return false;

      if (relativePath) {
        console.log(` Copying: ${relativePath}`);
      }
      return true;
    },
  });
}

/**
 * Merge a package.partial.json into the project's package.json
 * This merges dependencies, devDependencies, and scripts
 */
async function mergePackageJson(targetPath: string, partialPath: string) {
  const partialExists = await fs.pathExists(partialPath);
  if (!partialExists) return;

  const pkgPath = path.join(targetPath, "package.json");
  const pkgExists = await fs.pathExists(pkgPath);
  if (!pkgExists) return;

  const basePkg = await fs.readJson(pkgPath);
  const partial = await fs.readJson(partialPath);

  // Merge dependencies
  if (partial.dependencies) {
    basePkg.dependencies = {
      ...basePkg.dependencies,
      ...partial.dependencies,
    };
  }

  // Merge devDependencies
  if (partial.devDependencies) {
    basePkg.devDependencies = {
      ...basePkg.devDependencies,
      ...partial.devDependencies,
    };
  }

  // Merge scripts
  if (partial.scripts) {
    basePkg.scripts = {
      ...basePkg.scripts,
      ...partial.scripts,
    };
  }

  await fs.writeJson(pkgPath, basePkg, { spaces: 2 });
  console.log(" ✓ Merged ORM dependencies into package.json");
}

/**
 * Scaffold a project using layered templates:
 * 1. Copy express-base/ (shared Express files)
 * 2. Copy orm/{orm}/ (ORM-specific overlay)
 * 3. Merge package.partial.json into package.json
 * 4. Rename gitignore → .gitignore
 */
export async function scaffold(config: ProjectConfig, templatesRoot: string) {
  const { projectName, orm } = config;

  // 1. Resolve target path
  const cwd = process.cwd();
  const targetPath = projectName === "." ? cwd : path.join(cwd, projectName);

  // 2. Handle folder creation
  const exists = await fs.pathExists(targetPath);

  if (projectName === ".") {
    console.log("Using current directory:", targetPath);
  } else if (exists) {
    console.log(`Folder ${projectName} already exists. Skipping creation...`);
  } else {
    console.log(`Creating folder "${projectName}".....`);
    await fs.ensureDir(targetPath);
  }

  // 3. Copy express-base template (shared files)
  const baseDir = path.join(templatesRoot, "express-base");
  const baseExists = await fs.pathExists(baseDir);

  if (!baseExists) {
    console.error(`Error: Base template not found at ${baseDir}`);
    process.exit(1);
  }

  console.log("\nCopying shared Express files....");
  await copyTemplate(baseDir, targetPath);
  console.log("✓ Shared files copied successfully!");

  // 4. Copy ORM-specific overlay
  const ormDir = path.join(templatesRoot, "orm", orm);
  const ormExists = await fs.pathExists(ormDir);

  if (!ormExists) {
    console.error(`Error: ORM template not found at ${ormDir}`);
    process.exit(1);
  }

  console.log(`\nCopying ${orm} ORM files....`);
  await copyTemplate(ormDir, targetPath);
  console.log(`✓ ${orm} ORM files copied successfully!`);

  // 5. Merge ORM package.partial.json into package.json
  const partialPkgPath = path.join(ormDir, "package.partial.json");
  await mergePackageJson(targetPath, partialPkgPath);

  // 6. Rename gitignore → .gitignore
  const gitignorePath = path.join(targetPath, "gitignore");
  const dotGitignorePath = path.join(targetPath, ".gitignore");

  if (await fs.pathExists(gitignorePath)) {
    await fs.rename(gitignorePath, dotGitignorePath);
  }

  // 7. Print success message
  console.log("\n✨ Project scaffolded successfully!");
  console.log(`   Framework: Express`);
  console.log(`   ORM: ${orm}`);
  console.log(`\nNext steps:`);

  if (projectName !== ".") {
    console.log(`  cd ${projectName}`);
  }
  console.log(`  npm install`);

  // ORM-specific next steps
  if (orm === "prisma") {
    console.log(`  npx prisma generate`);
    console.log(`  npx prisma db push`);
  } else if (orm === "drizzle") {
    console.log(`  npx drizzle-kit push`);
  }

  console.log(`  npm run dev`);

  return targetPath;
}
