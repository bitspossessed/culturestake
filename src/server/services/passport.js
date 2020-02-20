import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as StrategyJWT, ExtractJwt } from 'passport-jwt';
import { Strategy as StrategyLocal } from 'passport-local';

import User from '~/server/models/user';

const JWT_ALGORITHM = 'HS512';
const JWT_EXPIRATION = '1h';

passport.use(
  new StrategyLocal(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          where: {
            email,
          },
        });

        if (!user) {
          return done(null, false);
        }

        const isPasswordCorrect = await user.comparePasswords(password);

        if (isPasswordCorrect) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.use(
  new StrategyJWT(
    {
      algorithms: [JWT_ALGORITHM],
      issuer: process.env.BASE_PATH,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findByPk(payload.userId);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export function signJWTToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: JWT_EXPIRATION,
    issuer: process.env.BASE_PATH,
  });
}

export default passport;
