import httpStatus from 'http-status';

import createSupertest from './helpers/supertest';
import tasksData from './data/tasks';
import { initializeDatabase } from './helpers/database';
import queue from '../src/server/tasks/sendmail';
import { delay } from './helpers/utils';
import { expectNoTasks, expectCompletedTasks } from './helpers/tasks';

describe('Tasks', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
  });

  afterAll(async () => {
    await queue.close();
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

        await authRequest
          .put('/api/tasks')
          .send(tasksData.voteInvitation)
          .expect(httpStatus.CREATED);

        // Give the task queue time to work through it's issues.
        await delay(1 * 1000, Promise.resolve());
        expectCompletedTasks(queue, 2);
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
  });
});
