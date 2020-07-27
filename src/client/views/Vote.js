import React, { Fragment, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import View from '~/client/components/View';
import { decodeVoteData } from '~/common/services/vote';

const Vote = () => {
  const { data } = useParams();

  const {
    festivalAnswerIds,
    festivalQuestionId,
    isDataValid,
    nonce,
    signature,
  } = useMemo(() => {
    try {
      return {
        ...decodeVoteData(data),
        isDataValid: true,
      };
    } catch {
      return {
        isDataValid: false,
      };
    }
  }, [data]);

  return (
    <Fragment>
      <View>
        {isDataValid}
        {festivalAnswerIds}
        {festivalQuestionId}
        {nonce}
        {signature}
      </View>
    </Fragment>
  );
};

export default Vote;
