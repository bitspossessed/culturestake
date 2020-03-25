import { respondWithSuccess } from '~/server/helpers/respond';

async function create(req, res, next) {
  try {
    // const result = await metaTxHandler.handle(req);
    // const receipt = await web3.eth.getTransactionReceipt(result);
    respondWithSuccess(res, {
      receipt: 'received',
    });
  } catch (error) {
    return next(error);
  }
}

export default {
  create,
};
