import httpStatus from 'http-status';

import { respondWithSuccess, respondWithError } from '~/server/helpers/respond';
import { voteInvitationEmail, voteEmail } from '~/server/tasks/sendmail';
import Invitation from '~/server/models/invitation';

async function create(req, res) {
  const { kind, data } = req.body;

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
        email: data.to,
        festivalSlug: data.festivalSlug,
      });
      if (!invitation) {
        return respondWithError(
          res,
          'No vote invitation found',
          httpStatus.NOT_FOUND,
        );
      }
      voteEmail(data.to, invitation);
      break;
    }
  }

  respondWithSuccess(res, undefined, httpStatus.CREATED);
}

export default {
  create,
};
