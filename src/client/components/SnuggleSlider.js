import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import debounce from 'debounce';
import styled from 'styled-components';

import styles, { DEFAULT_SCHEME } from '~/client/styles/variables';
import { SNUGGLEPUNKS_COUNT } from '~/client/components/SVGDefinitions';

const SNUGGLEPUNK_SIZE = 8;

const SnuggleSlider = ({
  credit,
  total,
  id,
  onChange,
  scheme = DEFAULT_SCHEME,
}) => {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const ref = useRef();

  // Calculate slider position
  const percentage = (credit / total) * 100;

  // Calculate SnugglePunk Happyness Factor === snuggleness!
  const totalVotePower = Math.sqrt(total);
  const currentVotePower = Math.sqrt(credit);
  const snuggleness =
    Math.round((currentVotePower / totalVotePower) * (SNUGGLEPUNKS_COUNT - 1)) +
    1;

  const updateValue = (event) => {
    const { x, width } = ref.current.getBoundingClientRect();

    const newCredit = Math.round(
      (Math.min(Math.max(0, event.pageX - x), width) / width) * total,
    );

    onChange({
      id,
      credit: newCredit,
    });
  };

  const debouncedUpdateValue = debounce(updateValue, 10);

  const onPointerDown = () => {
    setIsPointerDown(true);
  };

  const onPointerMove = (event) => {
    if (!isPointerDown) {
      return;
    }

    event.persist();
    debouncedUpdateValue(event);
  };

  const onPointerUp = () => {
    setIsPointerDown(false);
  };

  const onClick = (event) => {
    event.persist();
    debouncedUpdateValue(event);
  };

  useEffect(() => {
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <SnuggleSliderStyle
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <SnuggleSliderBarStyle
        percentage={percentage}
        ref={ref}
        scheme={scheme}
      />

      <SnuggleSliderHandleContainerStyle percentage={percentage}>
        <SnuggleSliderHandleStyle>
          <use xlinkHref={`#snugglepunk-${snuggleness}`} />
        </SnuggleSliderHandleStyle>
      </SnuggleSliderHandleContainerStyle>
    </SnuggleSliderStyle>
  );
};

const SnuggleSliderBarStyle = styled.div`
  width: 100%;
  height: 1.5rem;

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
`;

const SnuggleSliderHandleContainerStyle = styled.div`
  position: absolute;

  top: 0;
  right: ${SNUGGLEPUNK_SIZE / 2}rem;
  left: ${SNUGGLEPUNK_SIZE / 2}rem;

  transform: translate3d(${(props) => props.percentage}%, 0, 0);

  pointer-events: none;

  user-select: none;
`;

const SnuggleSliderHandleStyle = styled.svg`
  position: relative;

  left: ${-SNUGGLEPUNK_SIZE / 2}rem;

  width: ${SNUGGLEPUNK_SIZE}rem;
  height: ${SNUGGLEPUNK_SIZE}rem;

  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));

  transition: filter ease-in 0.2s;
`;

const SnuggleSliderStyle = styled.div`
  position: relative;

  display: flex;

  overflow: hidden;

  width: 100%;
  height: ${SNUGGLEPUNK_SIZE}rem;

  padding-right: ${SNUGGLEPUNK_SIZE / 2}rem;
  padding-left: ${SNUGGLEPUNK_SIZE / 2}rem;

  align-items: center;

  cursor: pointer;

  &:hover {
    ${SnuggleSliderHandleStyle} {
      filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.6));
    }
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
