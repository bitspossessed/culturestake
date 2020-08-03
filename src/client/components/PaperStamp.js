import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Paper, { PaperStyle } from '~/client/components/Paper';
import styles from '~/client/styles/variables';
import { useScheme } from '~/client/hooks/scheme';

const PaperStamp = (props) => {
  const { isAlternateColor, scheme } = useScheme();
  const innerScheme = isAlternateColor ? scheme : props.scheme;

  return (
    <PaperStampStyle
      isAlternateColor={isAlternateColor}
      isDisabled={props.isDisabled}
      scheme={innerScheme}
    >
      <PaperStampLine position="top" />
      <Paper scheme={innerScheme}>{props.children}</Paper>
      <PaperStampLine position="bottom" />
    </PaperStampStyle>
  );
};

const PaperStampLine = (props) => {
  return (
    <PaperStampLineStyle position={props.position}>
      <PaperStampLargeDotStyle position="left" />

      <PaperStampDotsStyle>
        <PaperStampLineDots />
      </PaperStampDotsStyle>

      <PaperStampLargeDotStyle position="right" />
    </PaperStampLineStyle>
  );
};

const PaperStampLineDots = () => {
  return new Array(22)
    .fill(0)
    .map((item, index) => <PaperStampDotsItemStyle key={index} />);
};

const PaperStampLineStyle = styled.div`
  position: absolute;

  top: ${(props) => (props.position === 'top' ? '0' : null)};
  right: 0;
  bottom: ${(props) => (props.position === 'bottom' ? '0' : null)};
  left: 0;

  z-index: ${styles.layers.PaperStamp};
`;

const PaperStampLargeDotStyle = styled.div`
  position: absolute;

  top: -4rem;
  right: ${(props) => (props.position === 'right' ? '-4rem' : null)};
  left: ${(props) => (props.position === 'left' ? '-4rem' : null)};

  z-index: ${styles.layers.PaperStamp};

  display: block;

  width: 8rem;
  height: 8rem;

  border-radius: 50%;

  content: '';

  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
`;

const PaperStampDotsStyle = styled.div`
  position: absolute;

  ${(props) => `padding-${props.position}`}: 3.5rem;

  top: -0.5rem;
  right: 4.25rem;
  left: 4.25rem;

  z-index: ${styles.layers.PaperStamp - 1};

  display: flex;

  overflow: hidden;

  height: 1.25rem;

  flex-wrap: wrap;
  justify-content: center;
`;

const PaperStampDotsItemStyle = styled.div`
  width: 1.25rem;
  height: 1.25rem;

  margin-right: 0.75rem;
  margin-left: 0.75rem;

  border-radius: 50%;

  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);

  flex-shrink: 0;
`;

const PaperStampStyle = styled.div`
  position: relative;

  & + & {
    ${/* sc-selector */ PaperStampLineStyle}:first-child {
      display: none;
    }
  }

  &:last-child {
    ${/* sc-selector */ PaperStyle} {
      margin-bottom: 0;
    }
  }

  &::after {
    position: absolute;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    z-index: ${styles.layers.PaperStampDisabled};

    display: ${(props) => (props.isDisabled ? 'block' : 'none')};

    content: '';

    background-color: ${(props) =>
      props.isAlternateColor
        ? 'rgba(0, 0, 0, 0.5)'
        : 'rgba(255, 255, 255, 0.5)'};
  }

  ${/* sc-selector */ PaperStampDotsItemStyle},
  ${/* sc-selector */ PaperStampLargeDotStyle} {
    background-color: ${(props) => {
      if (props.scheme) {
        return styles.schemes[props.scheme].backgroundSticker;
      }

      return styles.colors.white;
    }};
  }

  ${/* sc-selector */ PaperStyle} {
    margin-bottom: 2px;
    padding: 2rem;
    padding-top: 4rem;
    padding-bottom: 7rem;
  }
`;

PaperStamp.propTypes = {
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  scheme: PropTypes.string,
};

PaperStampLine.propTypes = {
  position: PropTypes.string.isRequired,
  scheme: PropTypes.string,
};

export default PaperStamp;
