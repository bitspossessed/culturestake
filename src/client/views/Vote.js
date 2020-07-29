import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Scanner from '~/client/components/Scanner';
import View from '~/client/components/View';
import VoteInterface from '~/client/components/VoteInterface';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { decodeVoteData } from '~/common/services/vote';
import { initializeVote, resetVote } from '~/client/store/vote/actions';

const Vote = () => {
  const dispatch = useDispatch();
  const vote = useSelector((state) => state.vote);
  const [voteDataEncoded, setVoteDataEncoded] = useState(null);

  const isVoteReady = !!vote.address;

  const onQRScanned = (data) => {
    setVoteDataEncoded(data);
  };

  const onScannerError = (error) => {
    dispatch(
      notify({
        text: translate('Vote.notificationScannerError', {
          error: error.message || 'Unknown error',
        }),
        type: NotificationsTypes.ERROR,
      }),
    );
  };

  useEffect(() => {
    if (!voteDataEncoded) {
      return;
    }

    try {
      const voteData = decodeVoteData(voteDataEncoded);
      dispatch(initializeVote(voteData));
    } catch (error) {
      dispatch(
        notify({
          text: translate('Vote.notificationVoteDataError'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  }, [dispatch, voteDataEncoded]);

  useEffect(() => {
    return () => {
      dispatch(resetVote());
    };
  }, [dispatch]);

  return (
    <Fragment>
      <View>
        {isVoteReady ? (
          <VoteInterface
            boothSignature={vote.boothSignature}
            festivalAnswerIds={vote.festivalAnswerIds}
            festivalQuestionId={vote.festivalQuestionId}
            nonce={vote.nonce}
            senderAddress={vote.address}
          />
        ) : (
          <Scanner onDetected={onQRScanned} onError={onScannerError} />
        )}
      </View>
    </Fragment>
  );
};

export default Vote;
