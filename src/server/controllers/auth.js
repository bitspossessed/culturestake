import { signJWTToken } from '~/server/services/passport';
import { respondWithSuccess } from '~/server/helpers/respond';

async function requestToken(req, res, next) {
  try {
    const payload = {
      userId: req.locals.user.id,
    };

    const token = signJWTToken(payload);

    respondWithSuccess(res, {
      token,
    });
  } catch (error) {
    return next(error);
  }
}

export default {
  requestToken,
};
