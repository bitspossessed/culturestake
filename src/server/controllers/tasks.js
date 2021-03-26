import httpStatus from 'http-status';

import { respondWithSuccess, respondWithError } from '~/server/helpers/respond';
import { voteInvitationEmail, voteEmail } from '~/server/tasks/sendmail';
import Invitation from '~/server/models/invitation';

// tasks which can only be submitted by a logged-in admin user
const tasksProtected = ['vote_invitations'];

async function create(req, res) {
  const { kind, data } = req.body;

  if (!req.locals.user && tasksProtected.includes(kind)) {
    return respondWithError(
      res,
      { message: 'Unauthorized' },
      httpStatus.UNAUTHORIZED,
    );
  }

  switch (kind) {
    case 'vote_invitations': {
      await Promise.all(
        data.map(async ({ to, ...rest }) => {
          await Invitation.create({ email: to, ...rest });
          return voteInvitationEmail(to, rest);
        }),
      );
      break;
    }
    case 'vote': {
      const invitation = await Invitation.findOne({
        where: {
          email: data.email,
          festivalSlug: data.festivalSlug,
        },
      });
      if (!invitation) {
        return respondWithError(
          res,
          { message: 'No vote invitation found' },
          httpStatus.NOT_FOUND,
        );
      }
      voteEmail(data.email, invitation);
      break;
    }
  }

  respondWithSuccess(res, undefined, httpStatus.CREATED);
}

export default {
  create,
};
