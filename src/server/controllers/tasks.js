import httpStatus from 'http-status';

import { respondWithSuccess } from '~/server/helpers/respond';
import { voteInvitationEmail } from '~/server/tasks/sendmail';

async function create(req, res) {
  const { kind, data } = req.body;

  switch (kind) {
    case 'vote_invitations': {
      await Promise.all(
        data.map(({ to, ...rest }) => voteInvitationEmail(to, rest)),
      );
    }
  }

  respondWithSuccess(res, undefined, httpStatus.CREATED);
}

export default {
  create,
};
