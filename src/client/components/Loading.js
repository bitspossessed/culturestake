import React from 'react';
import styled from 'styled-components';

import Spinner from '~/client/components/Spinner';
import translate from '~/common/services/i18n';
import { HeadingPrimaryStyle } from '~/client/styles/typography';

const Loading = () => {
  return (
    <LoadingStyle>
      <Spinner isLarge />

      <HeadingPrimaryStyle>
        {translate('Loading.bodyLoading')}
      </HeadingPrimaryStyle>
    </LoadingStyle>
  );
};

const LoadingStyle = styled.div`
  text-align: center;
`;

export default Loading;
