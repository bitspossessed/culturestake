import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import translate from '~/common/services/i18n';
import apiRequest from '~/client/services/api';
import { HeadingSecondaryStyle } from '~/client/styles/typography';
import styles from '~/client/styles/variables';
import swirl from '~/client/assets/images/swirl.svg';
import ButtonIcon from '~/client/components/ButtonIcon';
import { downloadAsFile } from '~/client/utils/downloads';

const ExportVotesContainer = ({ path }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getVotesCsv = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsLoading(true);

    const response = await apiRequest({
      path,
      headers: { 'Content-Type': 'text/csv' },
    });

    downloadAsFile('text/csv', response);

    setIsLoading(false);
  };

  return (
    <VoteweightsContainerStyle>
      <HeadingSecondaryStyle>
        {translate('ExportVotesContainer.title')}
      </HeadingSecondaryStyle>

      <ButtonIcon onClick={getVotesCsv} url={swirl} disabled={isLoading}>
        {translate('ExportVotesContainer.buttonDownload')}
      </ButtonIcon>
    </VoteweightsContainerStyle>
  );
};

export const VoteweightsContainerStyle = styled.section`
  position: relative;

  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;

  border: 1.5px solid
    ${(props) => (props.disabled ? styles.colors.gray : styles.colors.violet)};
  border-radius: 20px;

  color: ${(props) =>
    props.disabled ? styles.colors.gray : styles.colors.violet};
`;

ExportVotesContainer.propTypes = {
  path: PropTypes.arrayOf(PropTypes.string).required,
};

export default ExportVotesContainer;
