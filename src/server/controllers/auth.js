import { signJWTToken } from '../services/passport';
import { respondWithSuccess } from '../helpers/respond';

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
