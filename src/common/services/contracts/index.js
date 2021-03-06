import AdminContract from 'culturestake-contracts/build/contracts/Culturestake.json';
import QuestionContract from 'culturestake-contracts/build/contracts/Question.json';

import web3 from '~/common/services/web3';

// Utility methods to get contracts

function getContract(abi, address) {
  return new web3.eth.Contract(abi, address);
}

export function getAdminContract(address) {
  return getContract(AdminContract.abi, address);
}

export function getQuestionContract(address) {
  return getContract(QuestionContract.abi, address);
}

export async function isContract(address) {
  const code = await web3.eth.getCode(address);
  // A valid contract is a string with `0x` as a prefix. If no other characters
  // follow the prefix it is an invalid contract.
  if (/^0x.+/.test(code)) return true;
  return false;
}

// Admin contract methods

export const adminContract = getAdminContract(process.env.ADMIN_CONTRACT);

export async function getQuestion(chainId) {
  const data = await adminContract.methods.getQuestion(chainId).call();
  return {
    isInitialized: data[0],
    isDeactivated: data[1],
    address: data[2],
    festivalChainId: data[3],
    maxVoteTokens: parseInt(data[4], 10),
  };
}

export async function getVotingBooth(address) {
  const data = await adminContract.methods.getVotingBooth(address).call();
  return {
    isInitialized: data[0],
    isDeactivated: data[1],
    festivalChainId: data[2],
  };
}
