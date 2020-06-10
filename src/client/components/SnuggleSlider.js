import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles, { DEFAULT_SCHEME } from '~/client/styles/variables';

const SnuggleSlider = ({
  credit,
  total,
  id,
  onChange,
  scheme = DEFAULT_SCHEME,
}) => {
  const onInputChange = (event) => {
    onChange({
      id,
      credit: parseInt(event.target.value, 10),
    });
  };

  // @TODO: Show snugglepunks!
  // const totalVotePower = Math.sqrt(total);
  // const currentVotePower = Math.sqrt(credit);
  // const happyness = currentVotePower / totalVotePower;

  const percentage = (credit / total) * 100;

  return (
    <SnuggleSliderStyle
      max={total}
      min="0"
      percentage={percentage}
      scheme={scheme}
      step="1"
      type="range"
      value={credit}
      onChange={onInputChange}
    />
  );
};

const SnuggleSliderStyle = styled.input`
  @supports (-ms-ime-align: auto) {
    & {
      margin: 0;
    }
  }

  width: 100%;

  background-color: transparent;

  appearance: none;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 2rem;

    border: 1.5px solid;
    border-color: ${(props) => {
      return styles.schemes[props.scheme].foreground;
    }};
    border-radius: 10px;

    background-color: transparent;

    cursor: pointer;
  }

  &::-webkit-slider-thumb {
    opacity: 0;

    cursor: pointer;

    appearance: none;
  }

  &:focus::-webkit-slider-runnable-track {
    background-color: transparent;
  }

  &::-moz-range-track {
    width: 100%;
    height: 2rem;

    border: 1.5px solid;
    border-color: ${(props) => {
      return styles.schemes[props.scheme].foreground;
    }};
    border-radius: 10px;

    background: -webkit-linear-gradient(
      left,
      ${(props) => {
        const { foreground } = styles.schemes[props.scheme];
        return `${foreground} 0%, ${foreground} ${props.percentage}%, transparent ${props.percentage}%`;
      }}
    );

    cursor: pointer;
  }

  &::-moz-range-thumb {
    opacity: 0;

    cursor: pointer;
  }

  &::-ms-track {
    width: 100%;
    height: 2rem;

    border-width: 14.8px 0;
    border-color: transparent;

    color: transparent;

    background: transparent;

    cursor: pointer;
  }

  &::-ms-fill-lower {
    border: 1.5px solid;
    border-color: ${(props) => {
      return styles.schemes[props.scheme].foreground;
    }};
    border-radius: 10px;

    background-color: transparent;
  }

  &::-ms-fill-upper {
    border: 1.5px solid;
    border-color: ${(props) => {
      return styles.schemes[props.scheme].foreground;
    }};
    border-radius: 10px;

    background-color: transparent;
  }

  &::-ms-thumb {
    opacity: 0;
  }

  &:focus::-ms-fill-lower {
    background-color: transparent;
  }

  &:focus::-ms-fill-upper {
    background-color: transparent;
  }
`;

SnuggleSlider.propTypes = {
  credit: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  scheme: PropTypes.string,
  total: PropTypes.number.isRequired,
};

export default SnuggleSlider;
