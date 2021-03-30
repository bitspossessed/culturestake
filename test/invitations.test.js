import httpStatus from 'http-status';
import request from 'supertest';

import invitationsData from './data/invitations';
import Invitation from '~/server/models/invitation';
import { initializeDatabase } from './helpers/database';
import { closeRedis } from '~/server/services/redis';
import { setInRedis } from '~/server/services/redis';
import { generateRandomString } from '~/server/services/crypto';
import { delay } from './helpers/utils';

import app from '~/server';

describe('Invitations', () => {
  beforeAll(async () => {
    await initializeDatabase();
    await Invitation.create(invitationsData.invitation);
  });

  afterAll(async () => {
    await closeRedis();
  });

  describe('GET /api/invitations', () => {
    let random;

    beforeAll(async () => {
      random = generateRandomString(32);
      await setInRedis(
        random,
        `${invitationsData.invitation.email}:${invitationsData.invitation.festivalSlug}`,
        'EX',
        60 * 1, // expiring in 1 minutes
      );
    });

    it('should succeed in getting an invitation', async () => {
      await request(app)
        .get(`/api/invitations/${random}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const {
            booth,
            boothSignature,
            festivalSlug,
            nonce,
            festivalQuestionId,
          } = response.body.data;
          expect(booth).toBe(invitationsData.invitation.booth);
          expect(boothSignature).toBe(
            invitationsData.invitation.boothSignature,
          );
          expect(nonce).toBe(invitationsData.invitation.nonce);
          expect(festivalSlug).toBe(invitationsData.invitation.festivalSlug);
          expect(festivalQuestionId).toBe(
            invitationsData.invitation.festivalQuestionId,
          );
        });
    });

    it('should fail on second request', async () => {
      await request(app)
        .get(`/api/invitations/${random}`)
        .expect(httpStatus.NOT_FOUND);
    });

    it('should fail after invitation expiry', async () => {
      random = generateRandomString(32);
      await setInRedis(
        random,
        `${invitationsData.invitation.email}:${invitationsData.invitation.festivalSlug}`,
        'EX',
        3, // expiring in 3 seconds
      );

      await delay(4 * 1000, Promise.resolve());
      await request(app)
        .get(`/api/invitations/${random}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
