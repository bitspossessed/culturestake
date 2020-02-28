require('dotenv').config();

import httpStatus from 'http-status';
import request from 'supertest';
import MetaTxHandler from 'metatx-handler';

import { initializeDatabase } from './helpers/database';

import app from '~/server';
import blockchain from '~/common/services/web3';
import { getRelayerContract, getVoteContract } from '~/common/services/contracts';

let metaTxHandler;

describe('API', () => {
  let relayer;
  let vote;
  let sender;

  beforeAll(async () => {
    await initializeDatabase();
    console.log(process.env.RELAYER_CONTRACT);
    relayer = getRelayerContract(blockchain.web3, process.env.RELAYER_CONTRACT);
    vote = getVoteContract(blockchain.web3, process.env.VOTE_CONTRACT);
    sender = blockchain.web3.eth.accounts.create();
    metaTxHandler = new MetaTxHandler(
      process.env.PAYER_PRIV_KEY,
      blockchain.provider,
      process.env.RELAY_CONTRACT,
      relayer.options.jsonInterface,
    );
  });

  describe('POST /api/relay', () => {
    it('should respond with a successful message', async () => {
      const metaNonce = await relayer.methods.getNonce(sender.address).call();
      const txParams = {
        from: sender.address,
        to: relayer.options.address,
        value: 0,
        data: vote.methods.recordVote().encodeABI(),
      };
      const tx = new metaTxHandler.Transaction(txParams);
      const metaSignedTx = metaTxHandler.signMetaTx(
        tx,
        sender.privateKey,
        metaNonce,
      );
      await request(app)
        .post('/api/relay')
        .send({
          metaNonce,
          metaSignedTx,
        })
        .expect(httpStatus.OK, {
          status: 'ok',
        });
    });
  });
});
