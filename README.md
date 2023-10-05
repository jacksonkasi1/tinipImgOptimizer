# How to Use the Image Compression Script

This guide provides step-by-step instructions on how to use the provided JavaScript code to compress images in a specified folder. The script uses the Sharp library for image processing and can be used to compress images to the WebP format.

## Prerequisites

Before you begin, make sure you have the following:

1. **Node.js**: If you don't have Node.js installed, download and install it from the official website: [Node.js Official Website](https://nodejs.org/)

## Steps

Follow these steps to use the image compression script:

1. **Prepare Your Images**:
   - Place the images you want to compress in a folder. This folder will be referred to as `inputFolderPath`.

2. **Download the Code**:
   - Download the code provided in the question and save it as a JavaScript file, e.g., `server.js`.

3. **Open a Terminal or Command Prompt**:
   - On Windows, press `Win + R`, type `cmd`, and press Enter.
   - On macOS, open Spotlight (Cmd + Space), type `Terminal`, and press Enter.
   - On Linux, open a terminal window.

4. **Navigate to the Folder**:
   - Use the `cd` command to navigate to the folder where you saved the `server.js` file.

5. **Install Required Packages**:
   - Run the following command to install the required packages (`sharp`):
     ```
     npm install sharp
     ```

6. **Run the Script**:
   - Run the script using the following command, replacing `<input_folder_path>` with the actual path to your input folder:
     ```
     node serverjs
     ```
     For example:
     ```
     node server.js ./my_images
     ```
   - The script will start compressing images in the specified folder and its subfolders.

7. **Check the Output**:
   - Once the script finishes running, check the `output_folder` in the same directory where you ran the script. You'll find the compressed images there.

## Important Notes

- **Backup Your Original Images**: Before running this script, make sure to back up your original images, as it will modify or replace the image files in the output folder.

- **Adjust Compression Quality**: The code uses default compression settings. You can adjust the quality level in the `compressImage` function if needed.

- **Error Handling**: If you encounter any issues or errors during the process, refer to the error messages displayed in the terminal for troubleshooting.

Follow these steps to efficiently compress images using the provided script. Enjoy your compressed images!
