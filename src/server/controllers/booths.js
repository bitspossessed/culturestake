import httpStatus from 'http-status';

import redis from '~/server/services/redis';
import web3 from '~/common/services/web3';
import { respondWithSuccess } from '~/server/helpers/respond';

function create(req, res, next) {
  try {
    const booth = web3.eth.accounts.create();
    redis.set(booth.address, booth.privateKey);

    respondWithSuccess(res, { booth: booth.address }, httpStatus.CREATED);
  } catch (error) {
    return next(error);
  }
}

export default {
  create,
};
