import { respondWithSuccess } from '~/server/helpers/respond';
// import metaTxHandler from '~/server/services/metatx';
// import web3 from '~/common/services/web3';

async function create(req, res, next) {
  console.log(req.body)
  console.log('votecreate')
  try {
    // const result = await metaTxHandler.handle(req);
    // const receipt = await web3.eth.getTransactionReceipt(result);
    respondWithSuccess(res, {
      receipt: 'received',
    });
  } catch (error) {
    console.log(error)
    return next(error);
  }
}

export default {
  create,
};
