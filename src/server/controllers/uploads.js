import httpStatus from 'http-status';

import { respondWithSuccess } from '~/server/helpers/respond';

function uploadImages(req, res, next) {
  // @TODO: Store images in database
  respondWithSuccess(res, [], httpStatus.CREATED);
}

function uploadDocuments(req, res, next) {
  // @TODO: Store documents in database
  respondWithSuccess(res, [], httpStatus.CREATED);
}

export default {
  uploadImages,
  uploadDocuments,
};
