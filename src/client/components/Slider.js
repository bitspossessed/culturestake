import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import { useScheme } from '~/client/hooks/scheme';

const SNUGGLEPUNK_SIZE = 8;

// eslint-disable-next-line react/display-name
const Slider = React.forwardRef(
  ({ children, credit, total, ...props }, ref) => {
    const { scheme } = useScheme(props.scheme);
    const refBar = useRef();
    const refQuadBar = useRef();
    const refContainer = useRef();

    // Calculate slider position
    const percentage = (credit / total) * 100;
    console.log(Math.floor(Math.sqrt(percentage))) // eslint-disable-line

    useEffect(() => {
      // Update styles outside of React to improve performance
      refContainer.current.style.transform = `translate3d(${percentage}%, 0, 0)`;

      const { foreground } = styles.schemes[scheme];
      const gradient = `${foreground} 0%, ${foreground} ${percentage}%, transparent ${percentage}%`;
      refBar.current.style.background = `linear-gradient(to right, ${gradient})`;
      refQuadBar.current.style.background = `linear-gradient(to right, ${gradient})`;
    }, [refBar, refQuadBar, refContainer, percentage, scheme]);

    return (
      <SliderStyle {...props} ref={ref}>
        <SliderBarQuadtraticStyle
          percentage={Math.floor(Math.sqrt(percentage))}
          ref={refQuadBar}
          scheme={scheme}
        />
        <SliderBarStyle percentage={percentage} ref={refBar} scheme={scheme} />

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
  flex-direction: column;
`;

export const SliderBarQuadtraticStyle = styled.div`
  width: 100%;
  height: 1.5rem;

  margin-top: 2.5rem;

  border: 1.5px solid;
  border-color: ${(props) => {
    return styles.schemes[props.scheme].foreground;
  }};
  border-radius: 10px;
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
