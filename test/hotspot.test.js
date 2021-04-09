import httpStatus from 'http-status';

import { initializeDatabase } from './helpers/database';
import web3 from '~/common/services/web3';
import { closeRedis } from '~/server/services/redis';
import request from 'supertest';
import app from '~/server';
import artworksData from './data/artworks';
import propertiesData from './data/properties';
import festivalsData from './data/festivals';
import { put } from './helpers/requests';
import { isFestivalInitialized } from '~/common/services/contracts/festivals';
import { isVotingBoothInitialized } from '~/common/services/contracts/booths';
import {
  initAnswer,
  initQuestion,
  initFestival,
  initVotingBooth,
} from './helpers/transactions';
import {
  adminContract,
  getQuestionContract,
} from '~/common/services/contracts';
import { timestamp } from './helpers/constants';

describe('Hotspot', () => {
  let propertyData;
  let artworkData;
  let festivalData;
  let artworkQuestionContract;
  let festivalQuestionContract;
  let festivalAnswerData;
  let propertyAnswerData;
  let env = process.env;

  beforeAll(async () => {
    await initializeDatabase();

    artworkData = await put('/api/artworks', artworksData.davinci);
    propertyData = await put('/api/properties', propertiesData.aProperty);

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
  });

  afterAll(async () => {
    await closeRedis();
  });

  describe('GET /api/hotspot', () => {
    it('should fail when the hotspot booth is not initialized', async () => {
      const falseBooth = web3.eth.accounts.create();
      process.env.HOTSPOT_ADDRESS = falseBooth.address;
      process.env.HOTSPOT_PRIV_KEY = falseBooth.privateKey;
      await request(app).get('/api/hotspot').expect(httpStatus.UNAUTHORIZED);
    });

    describe('after booth is initialized', () => {
      beforeAll(async () => {
        process.env.HOTSPOT_ADDRESS = env.HOTSPOT_ADDRESS;
        process.env.HOTSPOT_PRIV_KEY = env.HOTSPOT_PRIV_KEY;
        const boothInitialized = await isVotingBoothInitialized(
          env.HOTSPOT_ADDRESS,
        );
        if (!boothInitialized) {
          await initVotingBooth(
            adminContract,
            festivalData.chainId,
            env.HOTSPOT_ADDRESS,
          );
        }
      });

      it('should succeed', async () => {
        await request(app)
          .get('/api/hotspot')
          .expect(httpStatus.OK)
          .expect((response) => {
            const { booth, festivalQuestionId } = response.body.data;
            expect(booth).toBe(env.HOTSPOT_ADDRESS);
            expect(festivalQuestionId).toBe(
              parseInt(env.HOTSPOT_FESTIVAL_QUESTION),
            );
          });
      });

      it('should fail when maximum votes are exceeded', async () => {
        process.env.HOTSPOT_MAX_VOTES = 0;
        await request(app)
          .get('/api/hotspot')
          .expect(httpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });
});
