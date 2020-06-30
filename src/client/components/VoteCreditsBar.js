import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';

const VoteCreditsBar = ({ total, left }) => {
  return (
    <VoteCreditsBarStyle>
      <VoteCreditsBarRangeStyle percentage={(left / total) * 100}>
        <VoteCreditsBarTextStyle>
          {translate('VoteCreditsBar.voteCredits')}
        </VoteCreditsBarTextStyle>
      </VoteCreditsBarRangeStyle>
    </VoteCreditsBarStyle>
  );
};

const VoteCreditsBarStyle = styled.div`
  position: fixed;

  right: ${styles.layout.spacing};
  bottom: 2.75rem;
  left: ${styles.layout.spacing};

  z-index: ${styles.layers.VoteCreditsBar};

  max-width: ${styles.layout.maxWidth};

  margin: 0 auto;

  user-select: none;

  pointer-events: none;
`;

const VoteCreditsBarRangeStyle = styled.div`
  @media ${styles.media.desktop} {
    margin-right: ${styles.layout.spacing};
    margin-left: ${styles.layout.spacing};
  }

  display: flex;

  height: 3rem;

  margin-left: 7rem;

  border: 1.5px solid;
  border-color: ${styles.colors.violet};
  border-radius: 20px;

  background: linear-gradient(
    to right,
    ${(props) => {
      return `${styles.colors.cyanLight} 0%, ${styles.colors.blueLight} ${props.percentage}%, transparent ${props.percentage}%`;
    }}
  );

  align-items: center;
`;

const VoteCreditsBarTextStyle = styled.span`
  margin-left: 1rem;

  color: ${styles.colors.violet};

  font-weight: ${styles.typography.weightBold};
  font-size: 1.1em;
`;

VoteCreditsBar.propTypes = {
  left: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default VoteCreditsBar;
