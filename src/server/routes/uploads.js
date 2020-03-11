import express from 'express';

import authMiddleware from '~/server/middlewares/passport';
import resizeImagesMiddleware from '~/server/middlewares/resizeImages';
import uploadFilesMiddleware from '~/server/middlewares/uploadFiles';
import uploadsController from '~/server/controllers/uploads';

const router = express.Router();

router.post(
  '/images',
  authMiddleware,
  uploadFilesMiddleware([
    {
      name: 'files',
    },
  ]),
  resizeImagesMiddleware([
    {
      name: 'files',
      versions: [
        {
          width: 1600,
          height: 1600,
        },
        {
          suffix: 'thresh',
          width: 1600,
          height: 1600,
          isThreshold: true,
        },
        {
          suffix: 'sm',
          width: 600,
          height: 600,
        },
        {
          suffix: 'sm-thresh',
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
      name: 'files',
      allowedFileTypes: ['pdf'],
      maxFileSize: 10 * 1000 * 1000,
    },
  ]),
  uploadsController.uploadDocuments,
);

export default router;
