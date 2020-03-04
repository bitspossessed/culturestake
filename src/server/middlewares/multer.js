import fs from 'fs';
import path from 'path';

import APIError from '~/server/helpers/errors';
import httpStatus from 'http-status';
import mime from 'mime';
import multer, { MulterError } from 'multer';

const DEFAULT_FIELD_NAME = 'files';
const DEFAULT_FILE_LIMIT = 1;
const DEFAULT_FILE_MAX_SIZE = 5 * 1000 * 1000;
const DEFAULT_FILE_TYPES = ['jpeg', 'jpg', 'png'];

export const UPLOAD_FOLDER_NAME = 'uploads';

export const UPLOAD_FOLDER_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  UPLOAD_FOLDER_NAME,
);

function generateFileName(ext) {
  const suffix = `${Date.now()}${Math.round(Math.random() * 1e9)}`;

  return `${suffix}.${ext}`;
}

export default function({
  allowedFileTypes = DEFAULT_FILE_TYPES,
  fieldName = DEFAULT_FIELD_NAME,
  fileLimit = DEFAULT_FILE_LIMIT,
  maxFileSize = DEFAULT_FILE_MAX_SIZE,
}) {
  const fileFilter = (req, file, cb) => {
    const ext = mime.getExtension(file.mimetype);

    if (allowedFileTypes.includes(ext)) {
      cb(new APIError('Invalid file format', httpStatus.BAD_REQUEST), false);
    } else {
      cb(null, true);
    }
  };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(UPLOAD_FOLDER_PATH)) {
        cb(new Error(`"${UPLOAD_FOLDER_PATH}" folder does not exist`));
      } else {
        cb(null, UPLOAD_FOLDER_PATH);
      }
    },
    filename: (req, file, cb) => {
      const ext = mime.getExtension(file.mimetype);
      cb(null, generateFileName(ext));
    },
  });

  const uploadFiles = multer({
    fileFilter,
    storage,
    limits: {
      fileSize: maxFileSize,
    },
  }).array(fieldName, fileLimit);

  return (req, res, next) => {
    uploadFiles((req, res, error) => {
      if (error instanceof MulterError) {
        next(new APIError(error.message, httpStatus.BAD_REQUEST));
      } else if (error) {
        next(error);
      } else {
        next();
      }
    });
  };
}
