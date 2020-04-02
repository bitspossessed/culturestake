import express from 'express';

import authMiddleware from '~/server/middlewares/passport';
import resizeImagesMiddleware from '~/server/middlewares/resizeImages';
import uploadFilesMiddleware from '~/server/middlewares/uploadFiles';
import uploadsController from '~/server/controllers/uploads';
import { getPath } from '~/server/helpers/path';

export const FIELD_NAME = 'files';

export const SUFFIX_DEFAULT = 'original';
export const SUFFIX_THRESHOLD = 'threshold';
export const SUFFIX_THRESHOLD_THUMB = 'threshold-thumb';
export const SUFFIX_THUMB = 'thumb';

export const UPLOAD_FOLDER_NAME = 'uploads';
export const UPLOAD_FOLDER_PATH = getPath(UPLOAD_FOLDER_NAME);

export const IMAGES_SUBFOLDER = 'images';
export const DOCUMENTS_SUBFOLDER = 'documents';

const router = express.Router();

router.post(
  '/images',
  authMiddleware,
  uploadFilesMiddleware([
    {
      name: FIELD_NAME,
    },
  ]),
  resizeImagesMiddleware([
    {
      name: FIELD_NAME,
      versions: [
        {
          suffix: SUFFIX_DEFAULT,
          width: 1600,
          height: 1600,
        },
        {
          suffix: SUFFIX_THRESHOLD,
          width: 1600,
          height: 1600,
          isThreshold: true,
        },
        {
          suffix: SUFFIX_THUMB,
          width: 600,
          height: 600,
        },
        {
          suffix: SUFFIX_THRESHOLD_THUMB,
          width: 600,
          height: 600,
          isThreshold: true,
        },
      ],
    },
  ]),
  uploadsController.uploadImages,
);

router.post(
  '/documents',
  authMiddleware,
  uploadFilesMiddleware([
    {
      name: FIELD_NAME,
      allowedFileTypes: ['pdf'],
      maxFileSize: 10 * 1000 * 1000,
    },
  ]),
  uploadsController.uploadDocuments,
);

export default router;
