import web3 from '~/common/services/web3';

const adminPrivKey = process.env.ADMIN_PRIV_KEY;
const admin = web3.eth.accounts.privateKeyToAccount(`0x${adminPrivKey}`);

export default async function sendTransaction(contract, data, sender) {
  const to = contract.options.address;
  const gas = await web3.eth.estimateGas({
    to,
    data,
    from: sender.address,
  });
  const nonce = await web3.eth.getTransactionCount(sender.address);
  const signed = await web3.eth.accounts.signTransaction(
    {
      from: sender.address,
      to,
      data,
      nonce,
      gas,
    },
    sender.privateKey,
  );

  return web3.eth.sendSignedTransaction(signed.rawTransaction);
}

export async function initFestival(adminContract, chainId, startTime, endTime) {
  const txData = adminContract.methods
    .initFestival(chainId, startTime, endTime)
    .encodeABI();
  await sendTransaction(adminContract, txData, admin);
}

export async function initVotingBooth(
  adminContract,
  festivalChainId,
  boothAddress,
) {
  const txData = adminContract.methods
    .initVotingBooth(festivalChainId, boothAddress)
    .encodeABI();
  await sendTransaction(adminContract, txData, admin);
}

export async function initQuestion(
  adminContract,
  chainId,
  festivalChainId,
  maxVoteTokens = 100,
) {
  // Deploy question contract
  const txData = adminContract.methods
    .initQuestion(chainId, maxVoteTokens, festivalChainId)
    .encodeABI();
  await sendTransaction(adminContract, txData, admin);

  // ... and retrieve contract address
  const logs = await adminContract.getPastEvents('InitQuestion', {
    fromBlock: 0,
    toBlock: 'latest',
  });
  return logs[logs.length - 1].returnValues.questionAddress;
}

export async function initAnswer(questionContract, chainId) {
  const txData = questionContract.methods.initAnswer(chainId).encodeABI();
  await sendTransaction(questionContract, txData, admin);
}
