import httpStatus from 'http-status';
import mime from 'mime';

import Document from '~/server/models/document';
import Image from '~/server/models/image';
import {
  DOCUMENTS_SUBFOLDER,
  FIELD_NAME,
  IMAGES_SUBFOLDER,
  SUFFIX_DEFAULT,
  SUFFIX_THRESHOLD,
  SUFFIX_THRESHOLD_THUMB,
  SUFFIX_THUMB,
} from '~/server/routes/uploads';
import {
  baseFileFields,
  imageFileFields,
} from '~/server/database/associations';
import {
  copyToUploadsDir,
  getVersionUrl,
  toFileUrl,
} from '~/server/helpers/uploads';
import {
  filterResponseAll,
  respondWithSuccess,
} from '~/server/helpers/respond';

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
    const fileEntries = images.map((versions) => {
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
      filterResponseAll(response, [...imageFileFields]),
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
    const fileEntries = files.map((file) => {
      return {
        fileName: file.filename,
        fileType: mime.getExtension(file.mimetype),
        url: toFileUrl(file.path, DOCUMENTS_SUBFOLDER),
      };
    });

    const response = await Document.bulkCreate(fileEntries);

    respondWithSuccess(
      res,
      filterResponseAll(response, [...baseFileFields]),
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
