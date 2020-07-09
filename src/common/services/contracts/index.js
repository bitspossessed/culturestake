import AdminContract from 'culturestake-contracts/build/contracts/Culturestake.json';
import QuestionContract from 'culturestake-contracts/build/contracts/Question.json';

import web3 from '~/common/services/web3';

function getContract(abi, address) {
  return new web3.eth.Contract(abi, address);
}

export function getAdminContract(address) {
  return getContract(AdminContract.abi, address);
}

export function getQuestionContract(address) {
  return getContract(QuestionContract.abi, address);
}

export const adminContract = getAdminContract(process.env.ADMIN_CONTRACT);
