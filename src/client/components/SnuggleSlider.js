import PropTypes from 'prop-types';
import React, { useEffect, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import Slider, { SliderStyle } from '~/client/components/Slider';
import { SNUGGLEPUNKS_COUNT } from '~/client/components/SVGDefinitions';
import { useScheme } from '~/client/hooks/scheme';

const SNUGGLEPUNK_SIZE = 8;

function isNotTouchEvent(event) {
  return (
    !event.touches ||
    event.touches.length > 1 ||
    (event.type.toLowerCase() === 'touchend' && event.touches.length > 0)
  );
}

const SnuggleSlider = ({ credit, total, id, onChange, ...props }) => {
  const { scheme } = useScheme(props.scheme);
  const ref = useRef();

  const [isDragging, setIsDragging] = useState(false);

  // Calculate SnugglePunk Happyness Factor === snuggleness!
  const totalVotePower = Math.sqrt(total);
  const currentVotePower = Math.sqrt(credit);
  const snuggleness =
    Math.round((currentVotePower / totalVotePower) * (SNUGGLEPUNKS_COUNT - 1)) +
    1;

  const updateValue = useCallback(
    (position) => {
      const { x, width } = ref.current.getBoundingClientRect();

      const newCredit = Math.round(
        (Math.min(Math.max(0, position - x), width) / width) * total,
      );

      if (credit === newCredit) {
        return;
      }

      onChange({
        id,
        credit: newCredit,
      });
    },
    [id, credit, onChange, total],
  );

  const onStart = (position) => {
    setIsDragging(true);
    updateValue(position);
  };

  const onMove = useCallback(
    (position) => {
      if (!isDragging) {
        return;
      }

      updateValue(position);
    },
    [isDragging, updateValue],
  );

  const onEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onMouseDown = (event) => {
    if (event.button !== 0) {
      return;
    }

    onStart(event.pageX);
  };

  const onTouchStart = (event) => {
    if (isNotTouchEvent(event)) {
      return;
    }

    onStart(event.touches[0].pageX);

    event.stopPropagation();
    event.preventDefault();
  };

  const onBlur = () => {
    onEnd();
  };

  useEffect(() => {
    const onMouseMove = (event) => {
      onMove(event.pageX);

      event.stopPropagation();
      event.preventDefault();
    };

    const onMouseUp = () => {
      onEnd();
    };

    const onTouchMove = (event) => {
      if (isNotTouchEvent(event)) {
        onEnd();
        return;
      }

      onMove(event.touches[0].pageX);

      event.stopPropagation();
      event.preventDefault();
    };

    const onTouchEnd = () => {
      onEnd();
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMove, onEnd]);

  return (
    <SnuggleSliderStyle>
      <Slider
        credit={credit}
        ref={ref}
        scheme={scheme}
        total={total}
        onBlur={onBlur}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <SnuggleSliderHandleStyle>
          <use xlinkHref={`#snugglepunk-${snuggleness}`} />
        </SnuggleSliderHandleStyle>
      </Slider>
    </SnuggleSliderStyle>
  );
};

const SnuggleSliderHandleStyle = styled.svg`
  position: relative;

  left: ${-SNUGGLEPUNK_SIZE / 2}rem;

  width: ${SNUGGLEPUNK_SIZE}rem;
  height: ${SNUGGLEPUNK_SIZE}rem;

  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));

  transition: filter ease-in 0.2s;
`;

const SnuggleSliderStyle = styled.div`
  cursor: pointer;

  ${SliderStyle} {
    height: ${SNUGGLEPUNK_SIZE}rem;

    padding-right: ${SNUGGLEPUNK_SIZE / 3}rem;
    padding-left: ${SNUGGLEPUNK_SIZE / 3}rem;
  }

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
