import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import Paper, { PaperStyle } from '~/client/components/Paper';
import styles, { SCHEME_ALTERNATE } from '~/client/styles/variables';

const PaperTicket = (props) => {
  const { isAlternateColor } = useSelector((state) => state.app);
  const innerScheme = isAlternateColor ? SCHEME_ALTERNATE : props.scheme;

  return (
    <PaperTicketStyle scheme={innerScheme}>
      <PaperTicketLine position="top" />
      <Paper scheme={innerScheme}>{props.children}</Paper>
      <PaperTicketLine position="bottom" />
    </PaperTicketStyle>
  );
};

const PaperTicketLine = (props) => {
  return (
    <PaperTicketLineStyle position={props.position}>
      <PaperTicketDotsStyle position="right">
        <PaperTicketLineDots />
      </PaperTicketDotsStyle>

      <PaperTicketLargeDotStyle scheme={props.scheme} />

      <PaperTicketDotsStyle position="left">
        <PaperTicketLineDots />
      </PaperTicketDotsStyle>
    </PaperTicketLineStyle>
  );
};

const PaperTicketLineDots = () => {
  return new Array(12)
    .fill(0)
    .map((item, index) => <PaperTicketDotsItemStyle key={index} />);
};

const PaperTicketLineStyle = styled.div`
  position: absolute;

  top: ${(props) => (props.position === 'top' ? '0' : null)};
  right: 0;
  bottom: ${(props) => (props.position === 'bottom' ? '0' : null)};
  left: 0;

  z-index: ${styles.layers.PaperTicket};
`;

const PaperTicketLargeDotStyle = styled.div`
  position: absolute;

  top: -4rem;
  left: 50%;

  display: block;

  width: 8rem;
  height: 8rem;

  border-radius: 50%;

  content: '';

  transform: translate3d(-50%, 0, 0);

  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
`;

const PaperTicketDotsStyle = styled.div`
  position: absolute;

  ${(props) => `padding-${props.position}`}: 5rem;

  top: -0.5rem;
  ${(props) => props.position}: 50%;

  z-index: ${styles.layers.PaperTicket};

  display: flex;

  overflow: hidden;

  width: 50%;
  max-width: 36rem;

  justify-content: ${(props) => {
    return props.position === 'left' ? 'flex-start' : 'flex-end';
  }};
`;

const PaperTicketDotsItemStyle = styled.div`
  width: 1.25rem;
  height: 1.25rem;

  margin-right: 0.75rem;
  margin-left: 0.75rem;

  border-radius: 50%;

  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);

  flex-shrink: 0;
`;

const PaperTicketStyle = styled.div`
  position: relative;

  & + & {
    ${/* sc-selector */ PaperTicketLineStyle}:first-child {
      display: none;
    }
  }

  &:last-child {
    ${/* sc-selector */ PaperStyle} {
      margin-bottom: 0;
    }
  }

  ${/* sc-selector */ PaperTicketDotsItemStyle},
  ${/* sc-selector */ PaperTicketLargeDotStyle} {
    background-color: ${(props) => {
      if (props.scheme) {
        return styles.schemes[props.scheme].backgroundSticker;
      }

      return styles.colors.white;
    }};
  }

  ${PaperStyle} {
    margin-bottom: 2px;
    padding: 2rem;
    padding-top: 4rem;
    padding-bottom: 7rem;
  }
`;

PaperTicket.propTypes = {
  children: PropTypes.node,
  scheme: PropTypes.string,
};

PaperTicketLine.propTypes = {
  position: PropTypes.string.isRequired,
  scheme: PropTypes.string,
};

export default PaperTicket;
