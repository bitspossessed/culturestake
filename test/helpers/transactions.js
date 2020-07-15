import web3 from '~/common/services/web3';

const payerPrivKey = process.env.PAYER_PRIV_KEY;
const payer = web3.eth.accounts.privateKeyToAccount(`0x${payerPrivKey}`);

export default async function sendTransaction(contract, data) {
  const to = contract.options.address;

  const gas = await web3.eth.estimateGas({
    to,
    data,
  });
  const nonce = await web3.eth.getTransactionCount(payer.address);
  const signed = await web3.eth.accounts.signTransaction(
    {
      from: payer.address,
      to,
      data,
      nonce,
      gas: gas.toString(),
    },
    payerPrivKey,
  );

  return web3.eth.sendSignedTransaction(signed.rawTransaction);
}

export async function initFestival(adminContract, chainId, startTime, endTime) {
  const txData = adminContract.methods
    .initFestival(chainId, startTime, endTime)
    .encodeABI();
  await sendTransaction(adminContract, txData);
}

export async function initVotingBooth(
  adminContract,
  festivalChainId,
  boothAddress,
) {
  const txData = adminContract.methods
    .initVotingBooth(festivalChainId, boothAddress)
    .encodeABI();
  await sendTransaction(adminContract, txData);
}

export async function initQuestion(
  adminContract,
  chainId,
  maxVoteTokens = 100,
) {
  // Deploy question contract
  const txData = adminContract.methods
    .initQuestion(maxVoteTokens, chainId)
    .encodeABI();
  await sendTransaction(adminContract, txData);

  // ... and retrieve contract address
  const logs = await adminContract.getPastEvents('InitQuestion', {
    fromBlock: 0,
    toBlock: 'latest',
  });
  return logs[logs.length - 1].returnValues.questionAddress;
}

export async function initAnswer(questionContract, chainId) {
  const txData = questionContract.methods.initAnswer(chainId).encodeABI();
  await sendTransaction(questionContract, txData);
}
