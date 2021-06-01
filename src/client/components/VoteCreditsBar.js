import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';

const VoteCreditsBar = ({ total, left }) => {
  const refBarRange = useRef();
  const { isAlternateColor } = useSelector((state) => state.app);

  useEffect(() => {
    const percentage = (left / total) * 100;
    const { yellow, blueLight, cyanLight } = styles.colors;

    const gradient = isAlternateColor
      ? `${yellow} 0%, ${yellow} ${percentage}%, transparent ${percentage}%`
      : `${cyanLight} 0%, ${blueLight} ${percentage}%, transparent ${percentage}%`;

    // Update styles outside of React to improve performance
    refBarRange.current.style.background = `linear-gradient(to top, ${gradient})`;
  }, [left, total, refBarRange, isAlternateColor]);

  return (
    <VoteCreditsBarStyle>
      <VoteCreditsBarRangeStyle
        isAlternateColor={isAlternateColor}
        ref={refBarRange}
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

  bottom: 2.75rem;
  left: ${styles.layout.spacing};

  z-index: ${styles.layers.VoteCreditsBar};

  margin: 0 auto;

  user-select: none;

  pointer-events: none;
`;

const VoteCreditsBarRangeStyle = styled.div`
  @media ${styles.media.desktop} {
    margin-right: ${styles.layout.spacing};
  }

  display: flex;

  height: 80vh;

  border: 1.5px solid;
  border-color: ${(props) =>
    props.isAlternateColor ? styles.colors.yellow : styles.colors.violet};
  border-radius: 20px;

  align-items: center;
`;

const VoteCreditsBarTextStyle = styled.span`
  mix-blend-mode: ${(props) => (props.isAlternateColor ? 'exclusion' : null)};

  margin-right: 0.5rem;
  margin-left: 0.5rem;
  writing-mode: vertical-rl;

  color: ${(props) =>
    props.isAlternateColor ? styles.colors.yellow : styles.colors.violet};

  font-weight: ${styles.typography.weightBold};
  font-size: 1.1em;

  transform: rotate(180deg);
`;

VoteCreditsBar.propTypes = {
  left: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default VoteCreditsBar;
