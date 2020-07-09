import AdminContract from 'culturestake-contracts/build/contracts/Culturestake.json';
import QuestionContract from 'culturestake-contracts/build/contracts/Question.json';

import web3 from '~/common/services/web3';
import festivals from '~/common/services/contracts/festivals';
import owners from '~/common/services/contracts/owners';
import booths from '~/common/services/contracts/booths';
import questions from '~/common/services/contracts/questions';

function getContract(abi, address) {
  return new web3.eth.Contract(abi, address);
}

export function getAdminContract(address) {
  return getContract(AdminContract.abi, address);
}

export function getQuestionContract(address) {
  return getContract(QuestionContract.abi, address);
}

const adminContract = getAdminContract(process.env.ADMIN_CONTRACT);

export default {
  festivalsModule: festivals(adminContract),
  ownersModule: owners(adminContract),
  boothsModule: booths(adminContract),
  questionsModule: questions(adminContract),
};
