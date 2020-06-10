import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Paper, { PaperStyle } from '~/client/components/Paper';
import styles from '~/client/styles/variables';

const PaperTicket = (props) => {
  return (
    <PaperTicketStyle>
      <PaperTicketLine position="top" scheme={props.scheme} />
      <Paper scheme={props.scheme}>{props.children}</Paper>
      <PaperTicketLine position="bottom" scheme={props.scheme} />
    </PaperTicketStyle>
  );
};

const PaperTicketLine = (props) => {
  return (
    <PaperTicketLineStyle position={props.position}>
      <PaperTicketDotsStyle position="right">
        <PaperTicketLineDots scheme={props.scheme} />
      </PaperTicketDotsStyle>

      <PaperTicketLargeDotStyle scheme={props.scheme} />

      <PaperTicketDotsStyle position="left">
        <PaperTicketLineDots scheme={props.scheme} />
      </PaperTicketDotsStyle>
    </PaperTicketLineStyle>
  );
};

const PaperTicketLineDots = (props) => {
  return new Array(12)
    .fill(0)
    .map((item, index) => (
      <PaperTicketDotsItemStyle key={index} scheme={props.scheme} />
    ));
};

const PaperTicketStyle = styled.div`
  position: relative;

  ${PaperStyle} {
    margin-bottom: 2px;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
`;

const PaperTicketLineStyle = styled.div`
  position: absolute;

  top: ${(props) => (props.top ? '1px' : null)};
  right: 0;
  bottom: ${(props) => (props.bottom ? '-1px' : null)};
  left: 0;

  z-index: ${styles.layers.PaperTicket};
`;

const PaperTicketLargeDotStyle = styled.div`
  position: absolute;

  top: -3rem;
  left: 50%;

  display: block;

  width: 6rem;
  height: 6rem;

  border-radius: 50%;

  content: '';

  background-color: ${(props) => {
    if (props.scheme) {
      return styles.schemes[props.scheme].backgroundSticker;
    }

    return styles.colors.white;
  }};

  transform: translate3d(-50%, 0, 0);

  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
`;

const PaperTicketDotsStyle = styled.div`
  position: absolute;

  ${(props) => `padding-${props.position}`}: 3.5rem;

  top: -0.5rem;
  ${(props) => props.position}: 50%;

  z-index: ${styles.layers.PaperTicket};

  display: flex;

  overflow: hidden;

  width: 50%;
  max-width: 33rem;

  justify-content: ${(props) => {
    return props.position === 'left' ? 'flex-start' : 'flex-end';
  }};
`;

const PaperTicketDotsItemStyle = styled.div`
  width: 1rem;
  height: 1rem;

  margin-right: 0.75rem;
  margin-left: 0.75rem;

  border-radius: 50%;

  background-color: ${(props) => {
    if (props.scheme) {
      return styles.schemes[props.scheme].backgroundSticker;
    }

    return styles.colors.white;
  }};

  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);

  flex-shrink: 0;
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
