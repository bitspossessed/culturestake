import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles, {
  DEFAULT_SCHEME,
  SCHEME_ALTERNATE,
} from '~/client/styles/variables';

const SNUGGLEPUNK_SIZE = 8;

// eslint-disable-next-line react/display-name
const Slider = React.forwardRef(
  ({ children, credit, total, scheme = DEFAULT_SCHEME, ...props }, ref) => {
    const { isAlternateColor } = useSelector((state) => state.app);
    const innerScheme = isAlternateColor ? SCHEME_ALTERNATE : scheme;
    const refBar = useRef();
    const refContainer = useRef();

    // Calculate slider position
    const percentage = (credit / total) * 100;

    useEffect(() => {
      // Update styles outside of React to improve performance
      refContainer.current.style.transform = `translate3d(${percentage}%, 0, 0)`;

      const { foreground } = styles.schemes[innerScheme];
      const gradient = `${foreground} 0%, ${foreground} ${percentage}%, transparent ${percentage}%`;
      refBar.current.style.background = `linear-gradient(to right, ${gradient})`;
    }, [refBar, refContainer, percentage, innerScheme]);

    return (
      <SliderStyle {...props} ref={ref}>
        <SliderBarStyle
          percentage={percentage}
          ref={refBar}
          scheme={innerScheme}
        />

        <SnuggleSliderHandleContainerStyle
          percentage={percentage}
          ref={refContainer}
        >
          {children}
        </SnuggleSliderHandleContainerStyle>
      </SliderStyle>
    );
  },
);

export const SliderStyle = styled.div`
  position: relative;

  display: flex;

  width: 100%;

  align-items: center;
`;

export const SliderBarStyle = styled.div`
  width: 100%;
  height: 1.5rem;

  border: 1.5px solid;
  border-color: ${(props) => {
    return styles.schemes[props.scheme].foreground;
  }};
  border-radius: 10px;
`;

export const SnuggleSliderHandleContainerStyle = styled.div`
  position: absolute;

  top: 0;
  right: ${SNUGGLEPUNK_SIZE / 3}rem;
  left: ${SNUGGLEPUNK_SIZE / 3}rem;

  pointer-events: none;

  user-select: none;
`;

Slider.propTypes = {
  children: PropTypes.node,
  credit: PropTypes.number.isRequired,
  scheme: PropTypes.string,
  total: PropTypes.number.isRequired,
};

export default Slider;
