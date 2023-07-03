const fs = require("fs");
const path = require("path");
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
const {
  createOutputFolder,
  handleDirectory,
  handleFile,
} = require("./utils");

const inputFolderPath = "./assets";
const outputFolderPath = "output_folder";
const maxFileSize = 512000; // Maximum file size in bytes (500 KB)

console.log(`Compressing images in ${inputFolderPath}...`);

createOutputFolder(outputFolderPath);

traverseFolder(inputFolderPath);

function traverseFolder(
  folderPath,
  totalFilesCount = { image: 0, other: 0 },
  convertedFilesCount = { webp: 0 }
) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      handleDirectory(filePath, inputFolderPath, outputFolderPath);
      traverseFolder(filePath, totalFilesCount, convertedFilesCount);
    } else {
      handleFile(
        filePath,
        folderPath,
        inputFolderPath,
        outputFolderPath,
        imageExtensions,
        maxFileSize,
        totalFilesCount,
        convertedFilesCount
      );
    }
  }
}
