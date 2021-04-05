import httpStatus from 'http-status';

import createSupertest from './helpers/supertest';
import tasksData from './data/tasks';
import invitationsData from './data/invitations';
import { initializeDatabase } from './helpers/database';
import queue from '../src/server/tasks/sendmail';
import { delay } from './helpers/utils';
import { expectNoTasks, expectCompletedTasks } from './helpers/tasks';
import web3 from '~/common/services/web3';
import { packBooth } from '~/common/services/encoding';
import { closeRedis } from '~/server/services/redis';
import Invitation from '~/server/models/invitation';
import request from 'supertest';
import app from '~/server';

describe('Tasks', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
  });

  afterAll(async () => {
    await queue.close();
    await closeRedis();
  });

  beforeEach(async () => {
    await queue.empty();
    await queue.clean(1);
  });

  afterEach(async () => {
    await queue.empty();
    await queue.clean(1);
  });

  describe('PUT /api/tasks', () => {
    it('should fail with an unknown task type', async () => {
      await authRequest
        .put('/api/tasks')
        .send({ kind: 'nonexistent' })
        .expect(httpStatus.BAD_REQUEST);

      await expectNoTasks(queue);
    });

    describe('scheduling vote invitation email tasks', () => {
      it('should succeed creating new email tasks', async () => {
        await expectNoTasks(queue);

        const booth = web3.eth.accounts.create();
        const voteInvitationsData = tasksData.voteInvitation.data.map(
          (invitation) => {
            return {
              ...invitation,
              booth: booth.address,
              boothSignature: web3.eth.accounts.sign(
                packBooth([invitation.festivalAnswerIds], invitation.nonce),
                booth.privateKey,
              ).signature,
            };
          },
        );

        await authRequest
          .put('/api/tasks')
          .send({ ...tasksData.voteInvitation, data: voteInvitationsData })
          .expect(httpStatus.CREATED);

        // Give the task queue time to work through it's issues.
        await delay(1 * 1000, Promise.resolve());
        expectCompletedTasks(queue, 2);
      });

      it('should fail to send vote invitations when unauthorized', async () => {
        await expectNoTasks(queue);

        const booth = web3.eth.accounts.create();
        const voteInvitationsData = tasksData.voteInvitation.data.map(
          (invitation) => {
            return {
              ...invitation,
              booth: booth.address,
              boothSignature: web3.eth.accounts.sign(
                packBooth([invitation.festivalAnswerIds], invitation.nonce),
                booth.privateKey,
              ).signature,
            };
          },
        );

        await request(app)
          .put('/api/tasks')
          .send({ ...tasksData.voteInvitation, data: voteInvitationsData })
          .expect(httpStatus.UNAUTHORIZED);

        await expectNoTasks(queue);
      });

      it('should fail with no recipients', async () => {
        const { kind } = tasksData.voteInvitation;

        await Promise.all([
          // No recipients.
          authRequest
            .put('/api/tasks')
            .send({ kind, data: [] })
            .expect(httpStatus.BAD_REQUEST),
          // Missing recipients.
          authRequest
            .put('/api/tasks')
            .send({ kind, data: [{ xxx: 'missing to field' }] })
            .expect(httpStatus.BAD_REQUEST),
        ]);

        await expectNoTasks(queue);
      });
    });

    describe('scheduling vote tasks', () => {
      beforeAll(async () => {
        await Invitation.create(invitationsData.invitation);
      });

      it('unauthenticated user should succeed creating new email tasks', async () => {
        await expectNoTasks(queue);

        await request(app)
          .put('/api/tasks')
          .send(tasksData.vote)
          .expect(httpStatus.CREATED);

        await delay(1 * 1000, Promise.resolve());
        expectCompletedTasks(queue, 1);
      });

      it('cannot create vote email task when there is no invitation', async () => {
        await expectNoTasks(queue);

        await Invitation.destroy({
          where: { email: invitationsData.invitation.email },
        });

        await request(app)
          .put('/api/tasks')
          .send(tasksData.vote)
          .expect(httpStatus.NOT_FOUND);

        await expectNoTasks(queue);
      });
    });
  });
});
