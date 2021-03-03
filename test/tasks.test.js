import httpStatus from 'http-status';

import createSupertest from './helpers/supertest';
import tasksData from './data/tasks';
import { initializeDatabase } from './helpers/database';
import queue from '../src/server/tasks/sendmail';

describe('Tasks', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    await queue.empty();
    authRequest = await createSupertest();
  });

  afterAll(async () => {
    await queue.empty();
  });

  describe('PUT /api/tasks', () => {
    it('should fail with an unknown task type', async () => {
      await authRequest
        .put('/api/tasks')
        .send({ kind: 'nonexistent' })
        .expect(httpStatus.BAD_REQUEST);
    });

    describe('scheduling vote invitation email tasks', () => {
      it('should succeed creating new email tasks', async () => {
        await authRequest
          .put('/api/tasks')
          .send(tasksData.voteInvitation)
          .expect(httpStatus.CREATED);
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
      });
    });
  });
});
