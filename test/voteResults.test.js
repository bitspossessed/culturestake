import httpStatus from 'http-status';
import request from 'supertest';

import { initializeDatabase } from './helpers/database';
import artworks from './data/artworks';
import answers from './data/answers';
import Answers from '~/server/models/answer';

import app from '~/server';
import web3 from '~/common/services/web3';
import {
  getAdminContract,
  getQuestionContract,
} from '~/common/services/contracts';
import createSupertest from './helpers/supertest';
import { packBooth, packVote } from '~/common/services/encoding';
import adminTx from './helpers/adminTx';

const refreshNonce = () => Math.floor(Math.random() * Math.floor(1000));

describe('API', () => {
  let authRequest;
  let answer;
  let admin;
  let question;
  let sender;
  let booth;
  let nonce;
  let vote;

  beforeAll(async () => {
    // add test data
    await initializeDatabase();
    authRequest = await createSupertest();
    await authRequest.put('/api/artworks').send(artworks.davinci);
    await authRequest.put('/api/answers').send(answers.artworkAnswer);

    // set up question contract
    admin = getAdminContract(process.env.ADMIN_CONTRACT);
    const logs = await admin.getPastEvents('InitQuestion', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    question = getQuestionContract(logs[0].returnValues.questionAddress);

    // add test answer
    answer = await Answers.findByPk(1);
    const data = question.methods.initAnswer(answer.chainId).encodeABI();
    await adminTx(question, data);

    // accounts for voting
    sender = web3.eth.accounts.create();
    booth = web3.eth.accounts.privateKeyToAccount(
      `0x${process.env.BOOTH_PRIV_KEY}`,
    );
    nonce = refreshNonce();

    vote = {
      signature: web3.eth.accounts.sign(
        packVote([answer.id], [1]),
        sender.privateKey,
      ).signature,
      sender: sender.address,
      booth: booth.address,
      boothSignature: web3.eth.accounts.sign(
        packBooth([answer.id], nonce),
        booth.privateKey,
      ).signature,
      nonce,
      question: question.options.address,
      answers: [answer.id],
      voteTokens: [1],
    };
    await request(app)
      .post('/api/vote')
      .send(vote);
  });

  afterAll(async () => {
    await authRequest.del('/api/artworks/mona-lisa');
    await authRequest.del('/api/answers/1');
  });

  describe('GET /api/vote', () => {
    it('should succesfully vote', async () => {
      await request(app)
        .get(`/api/vote/${question.options.address}`)
        .then((res) => {
          console.log(res.body)
        })
    });
  });
});
