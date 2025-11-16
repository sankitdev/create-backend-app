import path from "path";
import fs from "fs-extra";

export async function scaffold(projectName: string) {
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

  console.log("Final scaffold path:", targetPath);

  return targetPath;
}
