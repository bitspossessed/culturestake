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
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;

  text-align: center;

  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export default Loading;
