import basicAuth from 'express-basic-auth';

export default function basicAuthMiddleware(req, res, next) {
  if (process.env.BASIC_AUTH_PASSWORD) {
    return basicAuth({
      users: { admin: process.env.BASIC_AUTH_PASSWORD },
      challenge: true,
      realm: 'protected12',
    })(req, res, next);
  } else {
    return next();
  }
}
