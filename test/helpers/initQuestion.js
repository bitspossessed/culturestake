import web3 from '~/common/services/web3';

import adminTx from './adminTx';

export default async (adminContract, festival) => {
  const festivalSha = web3.utils.sha3(festival);
  // const isValid = await adminContract.methods.isValidFestival(festival).call();
  // console.log('isValid', isValid)
  const data = adminContract.methods.initQuestion(100, festivalSha).encodeABI();
  await adminTx(adminContract, data);
  const logs = await adminContract.getPastEvents('InitQuestion', {
    fromBlock: 0,
    toBlock: 'latest',
  });
  return logs[logs.length - 1].returnValues.questionAddress;
};
