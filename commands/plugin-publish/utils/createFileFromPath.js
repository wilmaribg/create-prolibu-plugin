import fs from "fs";
import path from "path";

// Function to get mime type based on file extension
const getMimeType = (fileName) => {
  const extname = path.extname(fileName).toLowerCase();
  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
  };
  return mimeTypes[extname] || "application/octet-stream";
};

// Function to convert a file path to a File object
export const createFileFromPath = (filePath, fileName) => {
  console.log("roge fileName ---->", fileName);
  const fileBuffer = fs.readFileSync(filePath); // Read the file into a buffer
  const file = new File([fileBuffer], fileName, {
    type: getMimeType(fileName),
  }); // Create a File object
  return file;
};
