const fs = require("fs");
const path = require("path");
const tinify = require("tinify");
require("dotenv").config();

// Set your API key
tinify.key = process.env.TINIFY_API_KEY;

const inputFolderPath = "./assets"; // input folder path
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"]; // image extensions to convert
const outputFolderPath = "output_folder"; // output folder path

console.log(`Compressing images in ${inputFolderPath} using Tinify...`);

// Create "output" folder if it doesn't exist
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath, { recursive: true });
}

// Traverse the input folder recursively and compress images with specified extensions
traverseFolder(inputFolderPath);

function traverseFolder(folderPath, totalFilesCount = { image: 0, other: 0 }, convertedFilesCount = { webp: 0 }) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const subfolderPath = path.join(outputFolderPath, path.relative(inputFolderPath, folderPath), file);
      if (!fs.existsSync(subfolderPath)) {
        fs.mkdirSync(subfolderPath, { recursive: true });
      }

      traverseFolder(filePath, totalFilesCount, convertedFilesCount);
    } else {
      const extname = path.extname(file);
      if (imageExtensions.includes(extname)) {
        totalFilesCount.image++;

        const subfolderPath = path.join(outputFolderPath, path.relative(inputFolderPath, folderPath));
        const outputFilePath = path.join(subfolderPath, file.replace(new RegExp(`(${imageExtensions.join("|")})$`, "i"), ".webp"));

        tinify.fromFile(filePath).toFile(outputFilePath, (err) => {
          if (err) {
            console.error(`Error compressing ${filePath} with Tinify:`, err);
          } else {
            convertedFilesCount.webp++;
            const percentage = Math.round((convertedFilesCount.webp / totalFilesCount.image) * 100);
            console.log(`Compressed ${path.basename(outputFilePath)} (${percentage}%)`);
          }
        });
      } else {
        totalFilesCount.other++;

        const subfolderPath = path.join(outputFolderPath, path.relative(inputFolderPath, folderPath));
        const outputFilePath = path.join(subfolderPath, file);

        fs.copyFile(filePath, outputFilePath, (err) => {
          if (err) {
            console.error(`Error copying ${filePath} to ${outputFilePath}:`, err);
          } else {
            console.log(`Copied ${path.basename(outputFilePath)}`);
          }
        });
      }
    }
  }
}