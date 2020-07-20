import httpStatus from 'http-status';
import request from 'supertest';

import app from '~/server';
import web3 from '~/common/services/web3';
import {
  getAdminContract,
  getQuestionContract,
} from '~/common/services/contracts';
import { packBooth, packVote } from '~/common/services/encoding';

import artworksData from './data/artworks';
import buildVote from './helpers/buildVote';
import createSupertest from './helpers/supertest';
import festivalsData from './data/festivals';
import getAccount from './helpers/getAccount';
import propertiesData from './data/properties';
import { initAnswer, initQuestion } from './helpers/transactions';
import { initializeDatabase } from './helpers/database';
import { refreshNonce } from './helpers/nonce';

async function put(path, body) {
  const authRequest = await createSupertest();
  const response = await authRequest.put(path).send(body);
  return response.body.data;
}

describe('Vote', () => {
  let adminContract;
  let anotherSender;
  let artworkData;
  let artworkQuestionContract;
  let booth;
  let festivalAnswerData;
  let festivalData;
  let festivalQuestionContract;
  let propertyAnswerData;
  let propertyData;
  let sender;
  let vote;

  beforeAll(async () => {
    await initializeDatabase();

    // Accounts for voting
    sender = getAccount(1);
    anotherSender = getAccount(2);
    booth = web3.eth.accounts.privateKeyToAccount(
      `0x${process.env.BOOTH_PRIV_KEY}`,
    );

    // Set up admin contract
    adminContract = getAdminContract(process.env.ADMIN_CONTRACT);

    // Add test data
    artworkData = await put('/api/artworks', artworksData.davinci);
    propertyData = await put('/api/properties', propertiesData.aProperty);
    festivalData = await put('/api/festivals', festivalsData.barbeque);

    // Use chainId from contract migrations
    festivalData.chainId = web3.utils.sha3('festival');
  });

  describe('POST /api/votes', () => {
    beforeEach(async () => {
      // Set up first question contract for artwork answers on an festival
      const festivalQuestionData = await put('/api/questions', {
        title: 'What was your favorite artwork of this festival?',
        festivalId: festivalData.id,
      });
      const festivalQuestionAddress = await initQuestion(
        adminContract,
        festivalQuestionData.chainId,
        festivalData.chainId,
      );
      festivalQuestionContract = getQuestionContract(festivalQuestionAddress);

      // Set up second question contract for property answers on an artwork
      const artworkQuestionData = await put('/api/questions', {
        title: 'What aspect of this artwork did you like and how much?',
        festivalId: festivalData.id,
        artworkId: artworkData.id,
      });
      const artworkQuestionAddress = await initQuestion(
        adminContract,
        artworkQuestionData.chainId,
        festivalData.chainId,
      );
      artworkQuestionContract = getQuestionContract(artworkQuestionAddress);

      // Add possible answers to API
      festivalAnswerData = await put('/api/answers', {
        type: 'artwork',
        artworkId: artworkData.id,
        questionId: festivalQuestionData.id,
      });
      propertyAnswerData = await put('/api/answers', {
        type: 'property',
        propertyId: propertyData.id,
        questionId: artworkQuestionData.id,
      });

      // Use chainId from API to create answer on blockchain
      await initAnswer(festivalQuestionContract, festivalAnswerData.chainId);
      await initAnswer(artworkQuestionContract, propertyAnswerData.chainId);

      // Create the actual vote of an user
      const festivalQuestionId = festivalQuestionData.id;
      const festivalAnswerIds = [festivalAnswerData.id];
      const festivalVoteTokens = [1];
      const artworkQuestionId = artworkQuestionData.id;
      const artworkAnswerIds = [propertyAnswerData.id];
      const artworkVoteTokens = [1];

      vote = buildVote(booth, sender, {
        festivalQuestionId,
        festivalAnswerIds,
        festivalVoteTokens,
        artworkQuestionId,
        artworkAnswerIds,
        artworkVoteTokens,
      });
    });

    it('should successfully vote', async () => {
      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.CREATED);
    });

    it('should fail when answer id not in database', async () => {
      vote.senderSignature = web3.eth.accounts.sign(
        packVote([31234], [1], [2], [2]),
        sender.privateKey,
      ).signature;

      vote.festivalAnswerIds = [31234];

      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.UNPROCESSABLE_ENTITY, {
          status: 'error',
          code: 422,
          message: 'Could not find answer 31234 in database',
        });
    });

    it('should fail with invalid booth address', async () => {
      vote.boothAddress = sender.address;
      vote.boothSignature = web3.eth.accounts.sign(
        packBooth([festivalAnswerData.id], vote.nonce),
        sender.privateKey,
      ).signature;

      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.UNPROCESSABLE_ENTITY, {
          status: 'error',
          code: 422,
          message: 'Invalid booth address',
        });
    });

    it('should fail with invalid booth signature', async () => {
      const falseBooth = web3.eth.accounts.create();
      const nonce = refreshNonce();

      vote.boothSignature = web3.eth.accounts.sign(
        packBooth([festivalAnswerData.id], nonce),
        falseBooth.privateKey,
      ).signature;

      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.UNPROCESSABLE_ENTITY, {
          status: 'error',
          code: 422,
          message: 'Invalid booth signature',
        });
    });

    it('should fail with invalid sender signature', async () => {
      const falseSender = web3.eth.accounts.create();

      vote.senderSignature = web3.eth.accounts.sign(
        packVote([festivalAnswerData.id], [1], [propertyAnswerData.id], [1]),
        falseSender.privateKey,
      ).signature;

      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.UNPROCESSABLE_ENTITY, {
          status: 'error',
          code: 422,
          message: 'Invalid sender signature',
        });
    });

    it('should fail when sender has already voted', async () => {
      // Send first request
      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.CREATED);

      // Get a new nonce but keep the rest
      vote.nonce = refreshNonce();
      vote.boothSignature = web3.eth.accounts.sign(
        packBooth([festivalAnswerData.id], vote.nonce),
        booth.privateKey,
      ).signature;

      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.UNPROCESSABLE_ENTITY, {
          status: 'error',
          code: 422,
          message: 'Duplicate vote in database',
        });
    });

    it('should fail when nonce has already been used', async () => {
      // Send first request
      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.CREATED);

      // Repeat request (same nonce) but with different sender
      vote.senderSignature = web3.eth.accounts.sign(
        packVote([festivalAnswerData.id], [1], [propertyAnswerData.id], [1]),
        anotherSender.privateKey,
      ).signature;
      vote.senderAddress = anotherSender.address;
      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.UNPROCESSABLE_ENTITY, {
          status: 'error',
          code: 422,
          message: 'Invalid nonce',
        });
    });

    // @TODO: Implement this test
    // it('should fail when invalid question', async () => {
    //   const question = web3.eth.accounts.create().address;
    //   await request(app)
    //     .post('/api/votes')
    //     .send(vote)
    //     .expect(httpStatus.UNPROCESSABLE_ENTITY);
    // });

    // @TODO: Implement this test
    // it('should fail when invalid festival', async () => {
    //   const festival = web3.utils.sha3('not a valid festival');
    //   await request(app)
    //     .post('/api/votes')
    //     .send(vote)
    //     .expect(httpStatus.UNPROCESSABLE_ENTITY);
    // });

    it('should fail when sending too many votes', async () => {
      const voteTokens = [101];

      vote.senderSignature = web3.eth.accounts.sign(
        packVote(
          [festivalAnswerData.id],
          voteTokens,
          [propertyAnswerData.id],
          [1],
        ),
        sender.privateKey,
      ).signature;
      vote.festivalVoteTokens = voteTokens;

      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.UNPROCESSABLE_ENTITY, {
          status: 'error',
          code: 422,
          message: 'Too many votes',
        });
    });

    it('should fail when sending too many vote items', async () => {
      const voteTokens = [1, 1];

      vote.senderSignature = web3.eth.accounts.sign(
        packVote(
          [festivalAnswerData.id],
          voteTokens,
          [propertyAnswerData.id],
          [1],
        ),
        sender.privateKey,
      ).signature;
      vote.festivalVoteTokens = voteTokens;

      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.UNPROCESSABLE_ENTITY, {
          status: 'error',
          code: 422,
          message: 'Wrong festival answer length',
        });
    });

    it('should fail when sending duplicates in answers array', async () => {
      const voteTokens = [1, 1];
      const voteAnswerIds = [festivalAnswerData.id, festivalAnswerData.id];

      vote.senderSignature = web3.eth.accounts.sign(
        packVote(voteAnswerIds, voteTokens, [propertyAnswerData.id], [1]),
        sender.privateKey,
      ).signature;
      vote.festivalAnswerIds = voteAnswerIds;
      vote.festivalVoteTokens = voteTokens;

      vote.boothSignature = web3.eth.accounts.sign(
        packBooth(voteAnswerIds, vote.nonce),
        booth.privateKey,
      ).signature;

      await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.UNPROCESSABLE_ENTITY, {
          status: 'error',
          code: 422,
          message: 'Duplicate answer',
        });
    });
  });
});
