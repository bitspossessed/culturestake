import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import View from '~/client/components/View';
import VoteSession from '~/client/components/VoteSession';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { initializeVote, resetVote } from '~/client/store/vote/actions';
import { useParams } from 'react-router-dom';
import { useResource } from '~/client/hooks/requests';
import Spinner from '~/client/components/Spinner';

const RemoteVote = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const vote = useSelector((state) => state.vote);

  const isVoteReady = !!vote.address;

  const [invitation, isInvitationLoading] = useResource([
    'invitations',
    params.token,
  ]);

  useEffect(() => {
    if (isInvitationLoading) {
      return;
    }

    try {
      dispatch(initializeVote(invitation));
    } catch (error) {
      dispatch(
        notify({
          text: translate('Vote.errorInvalidVoteData'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  }, [dispatch, invitation, isInvitationLoading]);

  useEffect(() => {
    return () => {
      dispatch(resetVote());
    };
  }, [dispatch]);

  return (
    <Fragment>
      <View>
        {isVoteReady && !isInvitationLoading ? (
          <VoteSession
            boothSignature={vote.boothSignature}
            festivalAnswerIds={vote.festivalAnswerIds}
            festivalQuestionId={vote.festivalQuestionId}
            nonce={vote.nonce}
            senderAddress={vote.address}
          />
        ) : (
          <Spinner />
        )}
      </View>
    </Fragment>
  );
};

export default RemoteVote;
