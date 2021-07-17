import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import { useScheme } from '~/client/hooks/scheme';
import { HorizontalSpacingStyle } from '~/client/styles/layout';

const SNUGGLEPUNK_SIZE = 6;

// eslint-disable-next-line react/display-name
const Slider = React.forwardRef(
  ({ children, credit, total, ...props }, ref) => {
    const { scheme } = useScheme(props.scheme);
    const refBar = useRef();
    const refQuadBar = useRef();
    const refContainer = useRef();

    // Calculate slider position
    const percentage = (credit / total) * 100;
    const votes = Math.floor(Math.sqrt(credit));
    const quadraticPercentage = (Math.sqrt(credit) / Math.sqrt(total)) * 100;

    useEffect(() => {
      // Update styles outside of React to improve performance
      refContainer.current.style.transform = `translate3d(${percentage}%, 0, 0)`;

      const { foreground } = styles.schemes[scheme];
      const { cyanLight } = styles.monochromes;
      const gradient = `${foreground} 0%, ${foreground} ${percentage}%, transparent ${percentage}%`;
      refBar.current.style.background = `linear-gradient(to right, ${gradient})`;
      const quadraticGradient = `${cyanLight} 0%, ${cyanLight} ${quadraticPercentage}%, transparent ${quadraticPercentage}%`;
      refQuadBar.current.style.background = `linear-gradient(to right, ${quadraticGradient})`;
    }, [
      refBar,
      refQuadBar,
      refContainer,
      percentage,
      scheme,
      quadraticPercentage,
    ]);

    return (
      <SliderStyle {...props} ref={ref}>
        <SliderBarContainerStyle>
          <SliderBarQuadtraticStyle
            percentage={Math.floor(Math.sqrt(percentage))}
            ref={refQuadBar}
            scheme={scheme}
          />
          <SliderNumberStyle>{votes}</SliderNumberStyle>
        </SliderBarContainerStyle>

        <LegendLabelStyle scheme={scheme}>Votes</LegendLabelStyle>

        <HorizontalSpacingStyle />

        <SliderBarContainerStyle>
          <SliderBarStyle
            percentage={percentage}
            ref={refBar}
            scheme={scheme}
          />
          <SliderNumberStyle>{credit}</SliderNumberStyle>
        </SliderBarContainerStyle>

        <LegendLabelStyle scheme={scheme}>Voice Credits</LegendLabelStyle>

        <HorizontalSpacingStyle />

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

export const LegendLabelStyle = styled.p`
  padding-top: 0.5rem;

  color: ${(props) => styles.schemes[props.scheme].foreground};
`;

export const SliderNumberStyle = styled.span`
  padding-left: 2rem;

  font-size: 2rem;
  font-family: ${styles.typography.familyHeading}, sans-serif;
`;

export const SliderBarContainerStyle = styled.div`
  display: flex;

  width: 100%;

  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const SliderStyle = styled.div`
  position: relative;

  display: flex;

  width: 100%;

  align-items: baseline;
  flex-direction: column;
`;

export const SliderBarQuadtraticStyle = styled.div`
  width: calc(100% - 5rem);
  height: 1.5rem;

  border: 1.5px solid;
  border-color: ${(props) => {
    return styles.schemes[props.scheme].foreground;
  }};
  border-radius: 10px;
`;

export const SliderBarStyle = styled.div`
  width: calc(100% - 5rem);
  height: 1.5rem;

  border: 1.5px solid;
  border-color: ${(props) => {
    return styles.schemes[props.scheme].foreground;
  }};
  border-radius: 10px;
`;

export const SnuggleSliderHandleContainerStyle = styled.div`
  position: absolute;

  top: 5rem;
  right: 5rem;
  left: ${SNUGGLEPUNK_SIZE / 4}rem;

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
