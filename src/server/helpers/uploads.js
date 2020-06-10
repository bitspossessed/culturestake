import fs from 'fs';
import path from 'path';

import {
  UPLOAD_FOLDER_NAME,
  UPLOAD_FOLDER_PATH,
} from '~/server/routes/uploads';

// Get relative web URL of a file version (thumbnail etc.)
export function getVersionUrl(versions, suffix, subfolder) {
  const { path: versionPath } = versions.find((file) => {
    return file.version.suffix === suffix;
  });

  return toFileUrl(versionPath, subfolder);
}

// Convert filesystem path to relative web URL
export function toFileUrl(filePath, subfolder) {
  const split = filePath.split('/');
  return `/${UPLOAD_FOLDER_NAME}/${subfolder}/${split[split.length - 1]}`;
}

// Convert relative web URL to filesystem path
export function toFilePath(fileUrl, subfolder) {
  const split = fileUrl.split('/');
  return path.join(UPLOAD_FOLDER_PATH, subfolder, split[split.length - 1]);
}

// Move files from temporary folder to uploads folder
export async function copyToUploadsDir(filePath, fileName, subfolder) {
  if (!fs.existsSync(UPLOAD_FOLDER_PATH)) {
    throw new Error(`"${UPLOAD_FOLDER_PATH}" folder does not exist`);
  }

  try {
    // Safely copy file from tmp folder to uploads folder
    await new Promise((resolve, reject) => {
      fs.copyFile(
        filePath,
        toFilePath(fileName, subfolder),
        fs.constants.COPYFILE_EXCL,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });

    // Remove original file in tmp folder
    await new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    throw new Error(
      `Could not copy file ${fileName} to uploads folder: ${error}`,
    );
  }
}

// Remove file from uploads folder
export async function removeFile(fileUrl, subfolder) {
  try {
    return new Promise((resolve, reject) => {
      fs.unlink(toFilePath(fileUrl, subfolder), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    throw new Error(
      `Could not delete file ${fileUrl} from uploads folder: ${error}`,
    );
  }
}
