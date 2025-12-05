import path from "path";
import fs from "fs-extra";

export async function scaffold(projectName: string, templateDir: string) {
  // 1. Get cwd
  const cwd = process.cwd();
  console.log(cwd, "current working directory");
  // 2. Resolve final project path
  const targetPath = projectName === "." ? cwd : path.join(cwd, projectName);
  // 3. Check if folder exists
  const exists = await fs.pathExists(targetPath);

  // 4. Handle folder creation / skipping
  if (projectName === ".") {
    console.log("Using current directory:", targetPath);
  } else if (exists) {
    console.log(`Folder ${projectName} already exists. Skipping creation...`);
  } else {
    console.log(`Creating folder "${projectName}".....`);
    await fs.ensureDir(targetPath);
  }

  // 5. Verify template directory exists
  const templateExists = await fs.pathExists(templateDir);
  if (!templateExists) {
    console.error(`Error: Template directory not found at ${templateDir}`);
    process.exit(1);
  }

  console.log("Copying template files....");

  try {
    await fs.copy(templateDir, targetPath, {
      overwrite: false,
      errorOnExist: false,
      filter: (src) => {
        const relativePath = path.relative(templateDir, src);

        // Exclude common folders and files that shouldn't be copied
        const excludePatterns = [
          'node_modules',
          '.git',
          'dist',
          'build',
          'coverage',
          '.env',
          '.DS_Store',
          'package-lock.json',
          'yarn.lock',
          'pnpm-lock.yaml'
        ];

        // Check if any part of the path matches excluded patterns
        const shouldExclude = excludePatterns.some(pattern => {
          const parts = relativePath.split(path.sep);
          return parts.includes(pattern) || relativePath === pattern;
        });

        if (shouldExclude) {
          return false; // Don't copy this file/folder
        }

        if (relativePath) {
          console.log(` Copying: ${relativePath}`);
        }
        return true;
      },
    });
    console.log("✓ Template files copied successfully!");

    // renaming gitignore to .gitignore (cause npm doesn't include it)
    const gitignorePath = path.join(targetPath, "gitignore");
    const dotGitignorePath = path.join(targetPath, ".gitignore");

    if (await fs.pathExists(gitignorePath)) {
      await fs.rename(gitignorePath, dotGitignorePath);
    }
  } catch (error) {
    console.error("Error copying template files:", error);
    process.exit(1);
  }

  console.log("\n✨ Project scaffolded successfully!");
  console.log(`\nNext steps:`);

  if (projectName !== ".") {
    console.log(`  cd ${projectName}`);
  }
  console.log(`  npm install`);
  console.log(`  npm run dev`);

  return targetPath;
}
