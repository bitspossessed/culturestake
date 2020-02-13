import supertest from 'supertest';

import users from '../data/users';

import User from '~/server/models/user';
import app from '~/server';
import { signJWTToken } from '~/server/services/passport';

let token;

export default async function createSupertest(options = {}) {
  const request = supertest.agent(app);
  const username = options.username || 'default';

  if (!options.isAuthDisabled) {
    if (options.token) {
      token = options.token;
    } else if (!token) {
      const [user] = await User.findOrCreate({
        where: {
          username: users[username].username,
        },
        defaults: users[username],
      });

      const payload = {
        userId: user.id,
      };

      token = signJWTToken(payload);
    }

    request.set('Authorization', `Bearer ${token}`);
  }

  return request;
}
