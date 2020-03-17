import fs from 'fs';
import path from 'path';

import httpStatus from 'http-status';
import mime from 'mime';

import Document from '~/server/models/document';
import Image from '~/server/models/image';
import {
  filterResponseAll,
  respondWithSuccess,
} from '~/server/helpers/respond';
import {
  DOCUMENTS_SUBFOLDER,
  FIELD_NAME,
  IMAGES_SUBFOLDER,
  SUFFIX_DEFAULT,
  SUFFIX_THRESHOLD,
  SUFFIX_THRESHOLD_THUMB,
  SUFFIX_THUMB,
  UPLOAD_FOLDER_NAME,
  UPLOAD_FOLDER_PATH,
} from '~/server/routes/uploads';

const IMAGE_FIELDS = [
  'id',
  'fileName',
  'fileType',
  'url',
  'urlThreshold',
  'urlThumb',
  'urlThresholdThumb',
  'createdAt',
  'updatedAt',
];

const DOCUMENT_FIELDS = [
  'id',
  'fileName',
  'fileType',
  'url',
  'createdAt',
  'updatedAt',
];

function getVersionUrl(versions, suffix, subfolder) {
  const { path: versionPath } = versions.find(file => {
    return file.version.suffix === suffix;
  });

  return toFileUrl(versionPath, subfolder);
}

function toFileUrl(filePath, subfolder) {
  const split = filePath.split('/');
  return `/${UPLOAD_FOLDER_NAME}/${subfolder}/${split[split.length - 1]}`;
}

async function copyToUploadsDir(filePath, fileName, subfolder) {
  if (!fs.existsSync(UPLOAD_FOLDER_PATH)) {
    throw new Error(`"${UPLOAD_FOLDER_PATH}" folder does not exist`);
  }

  try {
    // Safely copy file from tmp folder to uploads folder
    await new Promise((resolve, reject) => {
      fs.copyFile(
        filePath,
        path.join(UPLOAD_FOLDER_PATH, subfolder, fileName),
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
      await copyToUploadsDir(
        imageVersion.path,
        imageVersion.fileName,
        IMAGES_SUBFOLDER,
      );
    }

    // Convert image data to database model format
    const fileEntries = images.map(versions => {
      const fileName = versions[0].originalFileName;
      const fileType = versions[0].fileType;

      return {
        fileName,
        fileType,
        url: getVersionUrl(versions, SUFFIX_DEFAULT, IMAGES_SUBFOLDER),
        urlThreshold: getVersionUrl(
          versions,
          SUFFIX_THRESHOLD,
          IMAGES_SUBFOLDER,
        ),
        urlThresholdThumb: getVersionUrl(
          versions,
          SUFFIX_THRESHOLD_THUMB,
          IMAGES_SUBFOLDER,
        ),
        urlThumb: getVersionUrl(versions, SUFFIX_THUMB, IMAGES_SUBFOLDER),
      };
    });

    const response = await Image.bulkCreate(fileEntries);

    respondWithSuccess(
      res,
      filterResponseAll(response, IMAGE_FIELDS),
      httpStatus.CREATED,
    );
  } catch (error) {
    next(error);
  }
}

async function uploadDocuments(req, res, next) {
  try {
    const files = req.files[FIELD_NAME];

    // Move all files to /uploads folder to make them public
    for (let file of files) {
      await copyToUploadsDir(file.path, file.filename, DOCUMENTS_SUBFOLDER);
    }

    // Convert image data to database model format
    const fileEntries = files.map(file => {
      return {
        fileName: file.filename,
        fileType: mime.getExtension(file.mimetype),
        url: toFileUrl(file.path, DOCUMENTS_SUBFOLDER),
      };
    });

    const response = await Document.bulkCreate(fileEntries);

    respondWithSuccess(
      res,
      filterResponseAll(response, DOCUMENT_FIELDS),
      httpStatus.CREATED,
    );
  } catch (error) {
    next(error);
  }
}

export default {
  uploadImages,
  uploadDocuments,
};
