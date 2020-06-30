import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';

const VoteCreditsBar = ({ total, left }) => {
  const { isAlternateColor } = useSelector((state) => state.app);

  return (
    <VoteCreditsBarStyle>
      <VoteCreditsBarRangeStyle
        isAlternateColor={isAlternateColor}
        percentage={(left / total) * 100}
      >
        <VoteCreditsBarTextStyle isAlternateColor={isAlternateColor}>
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
  border-color: ${(props) =>
    props.isAlternateColor ? styles.colors.yellow : styles.colors.violet};
  border-radius: 20px;

  background: linear-gradient(
    to right,
    ${(props) => {
      if (props.isAlternateColor) {
        return `${styles.colors.yellow} 0%, ${styles.colors.yellow} ${props.percentage}%, transparent ${props.percentage}%`;
      }

      return `${styles.colors.cyanLight} 0%, ${styles.colors.blueLight} ${props.percentage}%, transparent ${props.percentage}%`;
    }}
  );

  align-items: center;
`;

const VoteCreditsBarTextStyle = styled.span`
  mix-blend-mode: ${(props) => (props.isAlternateColor ? 'exclusion' : null)};

  margin-left: 1rem;

  color: ${(props) =>
    props.isAlternateColor ? styles.colors.yellow : styles.colors.violet};

  font-weight: ${styles.typography.weightBold};
  font-size: 1.1em;
`;

VoteCreditsBar.propTypes = {
  left: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default VoteCreditsBar;
