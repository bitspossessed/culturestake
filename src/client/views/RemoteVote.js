import React, { Fragment, useEffect, useState } from 'react';
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
import { HeadingPrimaryStyle } from '~/client/styles/typography';
import { ContainerStyle } from '~/client/styles/layout';
import ColorSection from '~/client/components/ColorSection';
import Header from '~/client/components/Header';

const RemoteVote = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const vote = useSelector((state) => state.vote);
  const [isError, setIsError] = useState(false);

  const isVoteReady = !!vote.address;

  const [invitation, isInvitationLoading] = useResource(
    ['invitations', params.token],
    {
      onError: () => {
        setIsError(true);
        dispatch(
          notify({
            text: translate('RemoteVote.errorNotFound'),
          }),
        );
      },
    },
  );

  useEffect(() => {
    if (isInvitationLoading || isError) {
      return;
    }

    try {
      dispatch(resetVote());
      dispatch(initializeVote(invitation));
    } catch (error) {
      dispatch(
        notify({
          text: translate('RemoteVote.errorInvalidVoteData'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  }, [dispatch, invitation, isInvitationLoading, isError]);

  return (
    <Fragment>
      <View>
        {isVoteReady && !isInvitationLoading && !isError ? (
          <VoteSession
            boothSignature={vote.boothSignature}
            festivalAnswerIds={vote.festivalAnswerIds.sort()}
            festivalQuestionId={vote.festivalQuestionId}
            nonce={vote.nonce}
            senderAddress={vote.address}
          />
        ) : isError ? (
          <Header>
            <ContainerStyle>
              <ColorSection>
                <HeadingPrimaryStyle>
                  {translate('RemoteVote.notFoundTitle')}
                </HeadingPrimaryStyle>
              </ColorSection>
            </ContainerStyle>
          </Header>
        ) : (
          <Spinner />
        )}
      </View>
    </Fragment>
  );
};

export default RemoteVote;
