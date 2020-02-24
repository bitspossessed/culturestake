import Web3 from 'web3';

const rpcUrl = process.env.RPC_URL || 'http://localhost:8545';

const provider = new Web3.providers.WebsocketProvider(rpcUrl);
const web3 = new Web3(provider);

const connect = async () => {
  return (await web3.eth.getBlock('latest')).number;
};

export default { connect, web3, provider };
