import web3 from '~/common/services/web3';

const payerPrivKey = process.env.PAYER_PRIV_KEY;

const payer = web3.eth.accounts.privateKeyToAccount(`0x${payerPrivKey}`);

export default async function adminTx(contract, data) {
  const gas = await web3.eth.estimateGas({
    to: contract.options.address,
    data,
  });
  const signed = await web3.eth.accounts.signTransaction(
    {
      from: payer.address,
      to: contract.options.address,
      data,
      gas: gas.toString(),
    },
    payerPrivKey,
  );
  return web3.eth.sendSignedTransaction(signed.rawTransaction);
}
