import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles, { DEFAULT_SCHEME } from '~/client/styles/variables';

import snugglePunk1 from '~/client/assets/images/snugglepunk-1.svg';
import snugglePunk2 from '~/client/assets/images/snugglepunk-2.svg';
import snugglePunk3 from '~/client/assets/images/snugglepunk-3.svg';
import snugglePunk4 from '~/client/assets/images/snugglepunk-4.svg';
import snugglePunk5 from '~/client/assets/images/snugglepunk-5.svg';
import snugglePunk6 from '~/client/assets/images/snugglepunk-6.svg';
import snugglePunk7 from '~/client/assets/images/snugglepunk-7.svg';
import snugglePunk8 from '~/client/assets/images/snugglepunk-8.svg';
import snugglePunk9 from '~/client/assets/images/snugglepunk-9.svg';
import snugglePunk10 from '~/client/assets/images/snugglepunk-10.svg';
import snugglePunk11 from '~/client/assets/images/snugglepunk-11.svg';
import snugglePunk12 from '~/client/assets/images/snugglepunk-12.svg';

const snugglePunks = [
  snugglePunk1,
  snugglePunk2,
  snugglePunk3,
  snugglePunk4,
  snugglePunk5,
  snugglePunk6,
  snugglePunk7,
  snugglePunk8,
  snugglePunk9,
  snugglePunk10,
  snugglePunk11,
  snugglePunk12,
];

const SnuggleSlider = ({
  credit,
  total,
  id,
  onChange,
  scheme = DEFAULT_SCHEME,
}) => {
  const onInputChange = (event) => {
    const newCredit = parseInt(event.target.value, 10);

    onChange({
      id,
      credit: newCredit,
    });
  };

  // Calculate slider position
  const offset = 6; // Fix issue with the punk not reaching the end of the sliders
  const percentage = (credit / total) * (100 - offset * 2) + offset;

  // Calculate SnugglePunk Happyness Factor === snuggleness!
  const totalVotePower = Math.sqrt(total);
  const currentVotePower = Math.sqrt(credit);
  const snuggleness = Math.round(
    (currentVotePower / totalVotePower) * (snugglePunks.length - 1),
  );

  return (
    <SnuggleSliderStyle
      max={total}
      min="0"
      percentage={percentage}
      scheme={scheme}
      snuggleness={snuggleness}
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
    height: 1.2rem;

    border: 1.5px solid;
    border-color: ${(props) => {
      return styles.schemes[props.scheme].foreground;
    }};
    border-radius: 10px;

    background: linear-gradient(
      to right,
      ${(props) => {
        const { foreground } = styles.schemes[props.scheme];
        return `${foreground} 0%, ${foreground} ${props.percentage}%, transparent ${props.percentage}%`;
      }}
    );

    cursor: pointer;
  }

  &::-moz-range-thumb {
    position: relative;

    left: -4rem;

    width: 7rem;
    height: 7rem;

    border: 0;
    border-radius: 0;

    background: transparent;
    background-image: url(${(props) => snugglePunks[props.snuggleness]});
    background-position: center;
    background-size: over;

    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));

    opacity: 1;

    transition: filter ease-in 0.2s;

    cursor: pointer;

    &:hover {
      filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.6));
    }
  }

  /* @TODO: Make slider for IE/Edge */
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
