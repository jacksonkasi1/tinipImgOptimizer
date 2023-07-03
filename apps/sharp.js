const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

const inputFolderPath = './assets';
const outputFolderPath = 'output_folder';
const maxFileSize = 512000; // Maximum file size in bytes (500 KB)

console.log(`Compressing images in ${inputFolderPath}...`);

if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath, { recursive: true });
}

traverseFolder(inputFolderPath);

function compressImage(filePath, outputFilePath, quality = 80) {
  return sharp(filePath)
    .webp({ quality })
    .toFile(outputFilePath)
    .then((info) => {
      if (info.size > maxFileSize && quality > 10) {
        // Lower the quality by 10 and try again
        return compressImage(filePath, outputFilePath, quality - 10);
      } else {
        return info;
      }
    });
}

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
      const subfolderPath = path.join(
        outputFolderPath,
        path.relative(inputFolderPath, folderPath),
        file
      );
      if (!fs.existsSync(subfolderPath)) {
        fs.mkdirSync(subfolderPath, { recursive: true });
      }

      traverseFolder(filePath, totalFilesCount, convertedFilesCount);
    } else {
      const extname = path.extname(file);
      if (imageExtensions.includes(extname)) {
        totalFilesCount.image++;

        const subfolderPath = path.join(
          outputFolderPath,
          path.relative(inputFolderPath, folderPath)
        );
        const outputFilePath = path.join(
          subfolderPath,
          file.replace(
            new RegExp(`(${imageExtensions.join('|')})$`, 'i'),
            '.webp'
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
        const outputFilePath = path.join(subfolderPath, file);

        fs.copyFile(filePath, outputFilePath, (err) => {
          if (err) {
            console.error(
              `Error copying ${filePath} to ${outputFilePath}:`,
              err
            );
          } else {
            console.log(`Copied ${path.basename(outputFilePath)}`);
          }
        });
      }
    }
  }
}