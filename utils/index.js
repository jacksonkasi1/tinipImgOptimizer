const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

function compressImage(filePath, outputFilePath, quality = 80) {
  return sharp(filePath)
    .webp({ quality })
    .toFile(outputFilePath)
    .then((info) => {
      if (info.size > maxFileSize && quality > 10) {
        return compressImage(filePath, outputFilePath, quality - 10);
      } else {
        return info;
      }
    });
}

function createOutputFolder(outputFolderPath) {
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
  }
}

function handleDirectory(folderPath, inputFolderPath, outputFolderPath) {
  const subfolderPath = path.join(
    outputFolderPath,
    path.relative(inputFolderPath, folderPath)
  );
  if (!fs.existsSync(subfolderPath)) {
    fs.mkdirSync(subfolderPath, { recursive: true });
  }
}

function handleFile(
  filePath,
  folderPath,
  inputFolderPath,
  outputFolderPath,
  imageExtensions,
  maxFileSize,
  totalFilesCount,
  convertedFilesCount
) {
  const extname = path.extname(filePath);
  if (imageExtensions.includes(extname)) {
    totalFilesCount.image++;

    const subfolderPath = path.join(
      outputFolderPath,
      path.relative(inputFolderPath, folderPath)
    );
    const outputFilePath = path.join(
      subfolderPath,
      filePath.replace(
        new RegExp(`(${imageExtensions.join("|")})$`, "i"),
        ".webp"
      )
    );

    compressImage(filePath, outputFilePath)
      .then(() => {
        convertedFilesCount.webp++;
        const percentage = Math.round(
          (convertedFilesCount.webp / totalFilesCount.image) * 100
        );
        console.log(
          `Compressed ${path.basename(outputFilePath)} (${percentage}%)`
        );
      })
      .catch((err) => {
        console.error(`Error compressing ${filePath}:`, err);
      });
  } else {
    totalFilesCount.other++;

    const subfolderPath = path.join(
      outputFolderPath,
      path.relative(inputFolderPath, folderPath)
    );
    const outputFilePath = path.join(subfolderPath, filePath);

    fs.copyFile(filePath, outputFilePath, (err) => {
      if (err) {
        console.error(`Error copying ${filePath} to ${outputFilePath}:`, err);
      } else {
        console.log(`Copied ${path.basename(outputFilePath)}`);
      }
    });
  }
}

module.exports = {
  compressImage,
  createOutputFolder,
  handleDirectory,
  handleFile,
};