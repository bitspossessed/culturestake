import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';

import InlineSVG from '~/client/components/InlineSVG';
import corner from '~/client/assets/images/corner.svg';

const FramedBox = ({ children, ...props }) => {
  return (
    <FramedBoxStyle {...props}>
      {children}
      <FramedBoxCorner left top />
      <FramedBoxCorner right top />
      <FramedBoxCorner bottom left />
      <FramedBoxCorner bottom right />
    </FramedBoxStyle>
  );
};

const FramedBoxCorner = (props) => {
  return (
    <Suspense fallback={null}>
      <FramedBoxCornerStyle {...props}>
        <InlineSVG url={corner} />
      </FramedBoxCornerStyle>
    </Suspense>
  );
};

const FramedBoxStyle = styled.div`
  position: relative;

  display: flex;

  height: 14rem;

  padding: 2rem;

  text-align: center;

  align-items: center;
  justify-content: center;
`;

export const FramedBoxCornerStyle = styled.div`
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

FramedBox.propTypes = {
  children: PropTypes.node.isRequired,
};

FramedBoxCorner.propTypes = {
  bottom: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  top: PropTypes.bool,
};

export default FramedBox;
