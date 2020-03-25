import httpStatus from 'http-status';
import request from 'supertest';

import { initializeDatabase } from './helpers/database';

import app from '~/server';
import web3 from '~/common/services/web3';
import {
  getVoteContract,
} from '~/common/services/contracts';
import { packBooth, packVote } from '~/common/services/encoding';

describe('API', () => {
  // let vote;
  let sender;
  let booth;
  let answer = web3.utils.sha3('an answer');
  let festival = web3.utils.sha3('festival');

  beforeAll(async () => {
    await initializeDatabase();
    // vote = getVoteContract(process.env.VOTE_CONTRACT);
    sender = web3.eth.accounts.create();
    booth = web3.eth.accounts.create();
  });

  describe('POST /api/vote', () => {
    it('should successfully build the vote data', async () => {
      const vote = {
        signature: web3.eth.accounts.sign(
          packVote([answer], [1]),
          sender.privateKey,
        ).signature,
        sender: sender.address,
        booth: booth.address,
        boothSignature: web3.eth.accounts.sign(
          packBooth([answer], 1),
          booth.privateKey,
        ).signature,
        nonce: 1,
        festival,
        answers: [answer],
        voteTokens: [1],
      };
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.OK);
      })

    // it('should respond with a successful message', async () => {
    //   const metaNonce = await relayer.methods.getNonce(sender.address).call();
    //   const txParams = {
    //     from: sender.address,
    //     to: vote.options.address,
    //     value: 0,
    //     nonce: metaNonce,
    //     data: vote.methods.recordVote(sender.address).encodeABI(),
    //   };
    //   const metaSignedTx = await metaTxHandler.signMetaTx(
    //     txParams,
    //     sender.privateKey.substring(2),
    //     metaNonce,
    //   );
    //   await request(app)
    //     .post('/api/relay')
    //     .send({
    //       metaNonce,
    //       metaSignedTx,
    //     })
    //     .expect(httpStatus.OK);
    // });
  });
});
