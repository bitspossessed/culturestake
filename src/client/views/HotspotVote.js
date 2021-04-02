import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import View from '~/client/components/View';
import VoteSession from '~/client/components/VoteSession';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { initializeVote, resetVote } from '~/client/store/vote/actions';
import { useResource } from '~/client/hooks/requests';
import Spinner from '~/client/components/Spinner';
import { HeadingPrimaryStyle } from '~/client/styles/typography';
import { ContainerStyle } from '~/client/styles/layout';
import ColorSection from '~/client/components/ColorSection';
import Header from '~/client/components/Header';

const HotspotVote = () => {
  const dispatch = useDispatch();
  const vote = useSelector((state) => state.vote);
  const [isError, setIsError] = useState(false);

  const isVoteReady = !!vote.address;

  const [voteData, isVoteDataLoading] = useResource(['hotspot'], {
    onError: () => {
      setIsError(true);
      dispatch(
        notify({
          text: translate('HotspotVote.errorNotEnabled'),
        }),
      );
    },
  });

  useEffect(() => {
    if (isVoteDataLoading || isError) {
      return;
    }

    try {
      dispatch(resetVote());
      dispatch(initializeVote(voteData));
    } catch (error) {
      dispatch(
        notify({
          text: translate('HotspotVote.errorInvalidVoteData'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  }, [dispatch, voteData, isVoteDataLoading, isError]);

  return (
    <Fragment>
      <View>
        {isVoteReady && !isVoteDataLoading && !isError ? (
          <VoteSession
            boothSignature={vote.boothSignature}
            festivalAnswerIds={vote.festivalAnswerIds}
            festivalQuestionId={vote.festivalQuestionId}
            nonce={vote.nonce}
            senderAddress={vote.address}
          />
        ) : isError ? (
          <Header>
            <ContainerStyle>
              <ColorSection>
                <HeadingPrimaryStyle>
                  {translate('HotspotVote.notEnabled')}
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

export default HotspotVote;
