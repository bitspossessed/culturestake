import fs from 'fs';
import path from 'path';

import httpStatus from 'http-status';
import mime from 'mime';

import File from '~/server/models/file';
import { respondWithSuccess } from '~/server/helpers/respond';

import {
  FIELD_NAME,
  SUFFIX_DEFAULT,
  SUFFIX_THRESHOLD,
  SUFFIX_THRESHOLD_THUMB,
  SUFFIX_THUMB,
  UPLOAD_FOLDER_NAME,
  UPLOAD_FOLDER_PATH,
} from '~/server/routes/uploads';

function getVersionUrl(versions, suffix) {
  const { path: versionPath } = versions.find(file => {
    return file.version.suffix === suffix;
  });

  return toFileUrl(versionPath);
}

function toFileUrl(filePath) {
  const split = filePath.split('/');
  return `/${UPLOAD_FOLDER_NAME}/${split[split.length - 1]}`;
}

async function copyToUploadsDir(filePath, fileName) {
  if (!fs.existsSync(UPLOAD_FOLDER_PATH)) {
    throw new Error(`"${UPLOAD_FOLDER_PATH}" folder does not exist`);
  }

  try {
    // Safely copy file from tmp folder to uploads folder
    await new Promise((resolve, reject) => {
      fs.copyFile(
        filePath,
        path.join(UPLOAD_FOLDER_PATH, fileName),
        fs.constants.COPYFILE_EXCL,
        err => {
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
      fs.unlink(filePath, err => {
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

async function uploadImages(req, res, next) {
  try {
    const images = req.locals.images[FIELD_NAME];

    // Move all files to /uploads folder to make them public
    for (let imageVersion of images.flat()) {
      await copyToUploadsDir(imageVersion.path, imageVersion.fileName);
    }

    // Convert image data to database model format
    const fileEntries = images.map(versions => {
      const fileName = versions[0].originalFileName;
      const fileType = versions[0].fileType;

      return {
        fileName,
        fileType,
        url: getVersionUrl(versions, SUFFIX_DEFAULT),
        urlThreshold: getVersionUrl(versions, SUFFIX_THRESHOLD),
        urlThresholdThumb: getVersionUrl(versions, SUFFIX_THRESHOLD_THUMB),
        urlThumb: getVersionUrl(versions, SUFFIX_THUMB),
      };
    });

    const response = await File.bulkCreate(fileEntries);

    respondWithSuccess(res, response, httpStatus.CREATED);
  } catch (error) {
    next(error);
  }
}

async function uploadDocuments(req, res, next) {
  try {
    const files = req.files[FIELD_NAME];

    // Move all files to /uploads folder to make them public
    for (let file of files) {
      await copyToUploadsDir(file.path, file.filename);
    }

    // Convert image data to database model format
    const fileEntries = files.map(file => {
      return {
        fileName: file.filename,
        fileType: mime.getExtension(file.mimetype),
        url: toFileUrl(file.path),
      };
    });

    const response = await File.bulkCreate(fileEntries);

    respondWithSuccess(res, response, httpStatus.CREATED);
  } catch (error) {
    next(error);
  }
}

export default {
  uploadImages,
  uploadDocuments,
};
