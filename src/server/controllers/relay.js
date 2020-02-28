import { respondWithSuccess } from '~/server/helpers/respond';
import { metaTxHandler } from '~/server/services/metatx';
import blockchain from '~/common/services/web3';

async function relay(req, res, next) {
  try {
    const result = await metaTxHandler.handle(req);
    const receipt = await blockchain.web3.eth.getTransactionReceipt(result);

    respondWithSuccess(res, {
      receipt,
    });
  } catch (error) {
    return next(error);
  }
}

export default {
  relay,
};
