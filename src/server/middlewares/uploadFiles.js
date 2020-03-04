import fs from 'fs';
import path from 'path';

import APIError from '~/server/helpers/errors';
import httpStatus from 'http-status';
import mime from 'mime';
import multer, { MulterError } from 'multer';

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

// Handle file uploads for one or more fields, like:
//
// [
//    {
//      name: "images",
//      maxFileSize: 5 * 1000 * 1000,
//    },
//    {
//      name: "files",
//      allowedFileTypes: ['pdf'],
//    },
//    ...
// ]
export default function uploadFiles(fields) {
  const fileFilter = (req, file, cb) => {
    const ext = mime.getExtension(file.mimetype);

    const {
      maxFileSize = DEFAULT_FILE_MAX_SIZE,
      allowedFileTypes = DEFAULT_FILE_TYPES,
    } = fields[file.fieldname];

    if (allowedFileTypes.includes(ext)) {
      cb(
        new APIError('Invalid file format', httpStatus.UNSUPPORTED_MEDIA_TYPE),
        false,
      );
    } else if (file.size > maxFileSize) {
      cb(new APIError('File is too large', httpStatus.REQUEST_TOO_LONG), false);
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

  const uploadViaMulter = multer({
    fileFilter,
    storage,
  }).fields(fields);

  return (req, res, next) => {
    uploadViaMulter((req, res, error) => {
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
