import web3 from '~/common/services/web3';

import accounts from '../data/accounts.json';

export default function getAccount(index) {
  return web3.eth.accounts.privateKeyToAccount(accounts[index]);
}
