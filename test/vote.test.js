import httpStatus from 'http-status';
import request from 'supertest';

import app from '~/server';
import web3 from '~/common/services/web3';
import {
  adminContract,
  getQuestionContract,
} from '~/common/services/contracts';
import { packBooth, packVote } from '~/common/services/encoding';
import createSupertest from './helpers/supertest';

import artworksData from './data/artworks';
import buildVote from './helpers/buildVote';
import festivalsData from './data/festivals';
import getAccount from './helpers/getAccount';
import propertiesData from './data/properties';
import {
  initAnswer,
  initQuestion,
  initFestival,
  initVotingBooth,
} from './helpers/transactions';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';
import { refreshNonce } from './helpers/nonce';
import { timestamp } from './helpers/constants';
import { isFestivalInitialized } from '~/common/services/contracts/festivals';
import { isVotingBoothInitialized } from '~/common/services/contracts/booths';
import organisationsData from './data/organisations';
import voteweightsData from './data/voteweights';
import { closeRedis } from '~/server/services/redis';

describe('Vote', () => {
  let authRequest;
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
    authRequest = await createSupertest();

    // Accounts for voting
    sender = getAccount(1);
    anotherSender = getAccount(2);
    booth = web3.eth.accounts.privateKeyToAccount(
      `0x${process.env.BOOTH_PRIV_KEY}`,
    );

    // Add test data
    artworkData = await put('/api/artworks', artworksData.davinci);
    propertyData = await put('/api/properties', propertiesData.aProperty);
  });

  afterAll(async () => {
    await closeRedis();
  });

  describe('POST /api/votes', () => {
    beforeEach(async () => {
      // Add test data
      festivalData = await put('/api/festivals', festivalsData.barbeque);

      // Use chainId from contract migrations
      festivalData.chainId = web3.utils.sha3('festival');
      const festivalInitialized = await isFestivalInitialized(
        festivalData.chainId,
      );
      if (!festivalInitialized) {
        await initFestival(
          adminContract,
          festivalData.chainId,
          timestamp() + 20,
          timestamp() + 100000,
        );
      }
      const boothInitialized = await isVotingBoothInitialized(booth.address);
      if (!boothInitialized) {
        await initVotingBooth(
          adminContract,
          festivalData.chainId,
          booth.address,
        );
      }

      // Set up first question contract for artwork answers on an festival
      const festivalQuestionData = await put('/api/questions', {
        title: 'What was your favorite artwork of this festival?',
        type: 'festival',
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
        type: 'artwork',
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
        artworkId: artworkData.id,
        questionId: festivalQuestionData.id,
      });
      propertyAnswerData = await put('/api/answers', {
        propertyId: propertyData.id,
        questionId: artworkQuestionData.id,
      });

      // Use chainId from API to create answer on blockchain
      await initAnswer(festivalQuestionContract, festivalAnswerData.chainId);
      await initAnswer(artworkQuestionContract, propertyAnswerData.chainId);

      // Create the actual vote of an user
      vote = buildVote(booth, sender, {
        festivalQuestionId: festivalQuestionData.id,
        festivalAnswerIds: [festivalAnswerData.id],
        festivalVoteTokens: [10],
        artworkQuestionId: artworkQuestionData.id,
        artworkAnswerIds: [propertyAnswerData.id],
        artworkVoteTokens: [10],
      });
    });

    it('should successfully vote', async () => {
      await adminContract.methods.voteRelayer().call();
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
        packVote([festivalAnswerData.id], [10], [propertyAnswerData.id], [10]),
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

    it('should fail when sending too many votes', async () => {
      const voteTokens = [101];

      vote.senderSignature = web3.eth.accounts.sign(
        packVote(
          [festivalAnswerData.id],
          voteTokens,
          [propertyAnswerData.id],
          [10],
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
          [10],
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
        packVote(voteAnswerIds, voteTokens, [propertyAnswerData.id], [10]),
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

    it('should store the location if sent', async () => {
      vote.latitude = 4.5;
      vote.longitude = -3;

      const voteData = await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.CREATED);

      await authRequest
        .get(`/api/votes/${voteData.body.data.id}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const { latitude, longitude } = response.body.data;
          expect(latitude).toBe(vote.latitude);
          expect(longitude).toBe(vote.longitude);
        });
    });

    it('should apply and store a organisation vote weight', async () => {
      const org = await put(
        '/api/organisations',
        organisationsData.collectivise,
      );
      const voteweight = await put('/api/voteweights', {
        ...voteweightsData.organisationVoteweight,
        organisationId: org.id,
        festivalId: festivalData.id,
      });

      vote.organisationId = org.id;

      const voteData = await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.CREATED);

      await authRequest
        .get(`/api/votes/${voteData.body.data.id}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const {
            voteweights,
            festivalVoteTokens,
            artworkVoteTokens,
          } = response.body.data;
          expect(voteweights.length).toBe(1);
          expect(festivalVoteTokens).toStrictEqual(
            vote.festivalVoteTokens.map((item) => {
              return Math.floor(item * voteweight.multiplier);
            }),
          );
          expect(artworkVoteTokens).toStrictEqual(
            vote.artworkVoteTokens.map((item) => {
              return Math.floor(item * voteweight.multiplier);
            }),
          );
        });
    });

    it('should apply and store a hotspot vote weight', async () => {
      const voteweight = await put('/api/voteweights', {
        ...voteweightsData.hotspotVoteweight,
        hotspot: vote.boothAddress,
        festivalId: festivalData.id,
      });

      const voteData = await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.CREATED);

      await authRequest
        .get(`/api/votes/${voteData.body.data.id}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const {
            voteweights,
            festivalVoteTokens,
            artworkVoteTokens,
          } = response.body.data;
          expect(voteweights.length).toBe(1);
          expect(festivalVoteTokens).toStrictEqual(
            vote.festivalVoteTokens.map((item) => {
              return Math.floor(item * voteweight.multiplier);
            }),
          );
          expect(artworkVoteTokens).toStrictEqual(
            vote.artworkVoteTokens.map((item) => {
              return Math.floor(item * voteweight.multiplier);
            }),
          );
        });

      await authRequest.delete(`/api/voteweights/${voteweight.id}`);
    });

    it('should apply and store a location vote weight', async () => {
      const latitude = 4.56;
      const longitude = -78.4;

      const voteweight = await put('/api/voteweights', {
        ...voteweightsData.locationVoteweight,
        festivalId: festivalData.id,
        multiplier: 3.75,
        latitude,
        longitude,
        radius: 1000,
      });

      vote.latitude = latitude;
      vote.longitude = longitude;

      const voteData = await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.CREATED);

      await authRequest
        .get(`/api/votes/${voteData.body.data.id}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const {
            voteweights,
            festivalVoteTokens,
            artworkVoteTokens,
          } = response.body.data;
          expect(voteweights.length).toBe(1);
          expect(festivalVoteTokens).toStrictEqual(
            vote.festivalVoteTokens.map((item) => {
              return Math.floor(item * voteweight.multiplier);
            }),
          );
          expect(artworkVoteTokens).toStrictEqual(
            vote.artworkVoteTokens.map((item) => {
              return Math.floor(item * voteweight.multiplier);
            }),
          );
        });
    });

    it('should apply and store a negative vote weight', async () => {
      const voteweight = await put('/api/voteweights', {
        ...voteweightsData.hotspotVoteweight,
        hotspot: vote.boothAddress,
        festivalId: festivalData.id,
        multiplier: 0.75,
      });

      const voteData = await request(app)
        .post('/api/votes')
        .send(vote)
        .expect(httpStatus.CREATED);

      await authRequest
        .get(`/api/votes/${voteData.body.data.id}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const {
            voteweights,
            festivalVoteTokens,
            artworkVoteTokens,
          } = response.body.data;
          expect(voteweights.length).toBe(1);
          expect(festivalVoteTokens).toStrictEqual(
            vote.festivalVoteTokens.map((item) => {
              return Math.floor(item * voteweight.multiplier);
            }),
          );
          expect(artworkVoteTokens).toStrictEqual(
            vote.artworkVoteTokens.map((item) => {
              return Math.floor(item * voteweight.multiplier);
            }),
          );
        });

      await authRequest.delete(`/api/voteweights/${voteweight.id}`);
    });
  });
});
