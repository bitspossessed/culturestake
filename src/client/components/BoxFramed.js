import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';

import InlineSVG from '~/client/components/InlineSVG';
import corner from '~/client/assets/images/corner.svg';
import styles from '~/client/styles/variables';

const BoxFramed = ({ children, ...props }) => {
  return (
    <BoxFramedStyle {...props}>
      {children}
      <BoxFramedCorner left top />
      <BoxFramedCorner right top />
      <BoxFramedCorner bottom left />
      <BoxFramedCorner bottom right />
    </BoxFramedStyle>
  );
};

const BoxFramedCorner = (props) => {
  return (
    <Suspense fallback={null}>
      <BoxFramedCornerStyle {...props}>
        <InlineSVG url={corner} />
      </BoxFramedCornerStyle>
    </Suspense>
  );
};

const BoxFramedStyle = styled.div`
  position: relative;

  display: flex;

  min-height: 14rem;

  padding: 2rem;

  text-align: center;

  align-items: center;
  justify-content: center;

  h2 {
    @media ${styles.media.tablet} {
      font-size: 2em;
    }

    margin: 0;
  }
`;

export const BoxFramedCornerStyle = styled.div`
  position: absolute;

  top: ${(props) => (props.top ? '0' : null)};
  right: ${(props) => (props.right ? '0' : null)};
  bottom: ${(props) => (props.bottom ? '0' : null)};
  left: ${(props) => (props.left ? '0' : null)};

  width: 4rem;
  height: 4rem;

  transform: rotate(
    ${(props) => {
      if (props.bottom && props.right) {
        return '90deg';
      } else if (props.bottom && props.left) {
        return '180deg';
      } else if (props.top && props.left) {
        return '270deg';
      } else {
        return '0deg';
      }
    }}
  );
`;

BoxFramed.propTypes = {
  children: PropTypes.node.isRequired,
};

BoxFramedCorner.propTypes = {
  bottom: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  top: PropTypes.bool,
};

export default BoxFramed;
