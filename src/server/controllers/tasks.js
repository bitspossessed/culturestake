import httpStatus from 'http-status';

import { respondWithSuccess } from '~/server/helpers/respond';
import { voteInvitationEmail } from '~/server/tasks/sendmail';
import Invitation from '~/server/models/Invitation';

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
    }
  }

  respondWithSuccess(res, undefined, httpStatus.CREATED);
}

export default {
  create,
};
