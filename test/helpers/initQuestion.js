import web3 from '~/common/services/web3';

import adminTx from '.adminTx';

export default async (adminContract, question, festival) => {
  const questionSha = web3.utils.sha3(question);
  const festivalSha = web3.utils.sha3(festival);
  const data = adminContract
    .initQuestion(1, questionSha, 100, festivalSha)
    .encodeABI();
  await adminTx(adminContract, data);
  const logs = await adminContract.getPastEvents('InitQuestion', {
    fromBlock: 0,
    toBlock: 'latest',
  });
  return logs[logs.length - 1].returnValues.questionAddress;
};
