import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';
import apiRequest from '~/client/services/api';
import { HeadingSecondaryStyle } from '~/client/styles/typography';
import styles from '~/client/styles/variables';
import swirl from '~/client/assets/images/swirl.svg';
import ButtonIcon from '~/client/components/ButtonIcon';
import { downloadAsFile } from '~/client/utils/downloads';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const ExportVotesContainer = ({ name, path }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (e) => {
    const msg =
      e.response.code === 404
        ? translate('ExportVotesContainer.csvEmpty')
        : translate('default.errorMessage');

    dispatch(
      notify({
        text: msg,
        type: NotificationsTypes.ERROR,
      }),
    );
  };

  const getVotesCsv = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest({
        path,
        headers: { 'Content-Type': 'text/csv' },
      });

      downloadAsFile('text/csv', `votes-${name}.csv`, response);
    } catch (e) {
      handleError(e);
    }

    setIsLoading(false);
  };

  return (
    <VoteweightsContainerStyle>
      <HeadingSecondaryStyle>
        {translate('ExportVotesContainer.title')}
      </HeadingSecondaryStyle>

      <ButtonIcon isDisabled={isLoading} url={swirl} onClick={getVotesCsv}>
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
    ${(props) => (props.isDisabled ? styles.colors.gray : styles.colors.violet)};
  border-radius: 20px;

  color: ${(props) =>
    props.isDisabled ? styles.colors.gray : styles.colors.violet};
`;

ExportVotesContainer.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ExportVotesContainer;
