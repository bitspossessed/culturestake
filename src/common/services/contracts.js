import RelayerContract from 'culturestake-contracts/build/contracts/Relayer.json';
import AdminContract from 'culturestake-contracts/build/contracts/Admin.json';
import VoteContract from 'culturestake-contracts/build/contracts/Vote.json';

/**
 * Helper method to get a deployed smart contract instance.
 *
 * @param {Web3} web3 - Web3 instance
 * @param {Object} abi - contract abi
 * @param {Object} address - contract address
 *
 * @return {Object} - contract instance
 */
function getContract(web3, abi, address) {
  return new web3.eth.Contract(abi, address);
}

/**
 * Returns deployed Relayer smart contract instance.
 *
 * @param {Web3} web3 - Web3 instance
 * @param {Object} address - contract address
 *
 * @return {Object} - contract instance
 */
export function getRelayerContract(web3, address) {
  return getContract(web3, RelayerContract.abi, address);
}

/**
 * Returns deployed Admin smart contract instance.
 *
 * @param {Web3} web3 - Web3 instance
 * @param {Object} address - contract address
 *
 * @return {Object} - contract instance
 */
export function getAdminContract(web3, address) {
  return getContract(web3, AdminContract.abi, address);
}

/**
 * Returns deployed Vote smart contract instance.
 *
 * @param {Web3} web3 - Web3 instance
 * @param {Object} address - contract address
 *
 * @return {Object} - contract instance
 */
export function getVoteContract(web3, address) {
  return getContract(web3, VoteContract.abi, address);
}

