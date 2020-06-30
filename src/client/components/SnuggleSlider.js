import PropTypes from 'prop-types';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles, {
  DEFAULT_SCHEME,
  SCHEME_ALTERNATE,
} from '~/client/styles/variables';
import { SNUGGLEPUNKS_COUNT } from '~/client/components/SVGDefinitions';

const SNUGGLEPUNK_SIZE = 8;

function isNotTouchEvent(event) {
  return (
    !event.touches ||
    event.touches.length > 1 ||
    (event.type.toLowerCase() === 'touchend' && event.touches.length > 0)
  );
}

const SnuggleSlider = ({
  credit,
  total,
  id,
  onChange,
  scheme = DEFAULT_SCHEME,
}) => {
  const { isAlternateColor } = useSelector((state) => state.app);
  const innerScheme = isAlternateColor ? SCHEME_ALTERNATE : scheme;

  const [isDragging, setIsDragging] = useState(false);

  const refContainer = useRef();
  const refBar = useRef();

  // Calculate slider position
  const percentage = (credit / total) * 100;

  // Calculate SnugglePunk Happyness Factor === snuggleness!
  const totalVotePower = Math.sqrt(total);
  const currentVotePower = Math.sqrt(credit);
  const snuggleness =
    Math.round((currentVotePower / totalVotePower) * (SNUGGLEPUNKS_COUNT - 1)) +
    1;

  const updateValue = useCallback(
    (position) => {
      const { x, width } = refBar.current.getBoundingClientRect();

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

  // const debouncedUpdateValue = debounce(updateValue, 10);

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

  useEffect(() => {
    // Update styles outside of React to improve performance
    refContainer.current.style.transform = `translate3d(${percentage}%, 0, 0)`;

    const { foreground } = styles.schemes[innerScheme];
    const gradient = `${foreground} 0%, ${foreground} ${percentage}%, transparent ${percentage}%`;
    refBar.current.style.background = `linear-gradient(to right, ${gradient})`;
  }, [refContainer, percentage, innerScheme]);

  return (
    <SnuggleSliderStyle
      onBlur={onBlur}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <SnuggleSliderBarStyle
        percentage={percentage}
        ref={refBar}
        scheme={innerScheme}
      />

      <SnuggleSliderHandleContainerStyle
        percentage={percentage}
        ref={refContainer}
      >
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
`;

const SnuggleSliderHandleContainerStyle = styled.div`
  position: absolute;

  top: 0;
  right: ${SNUGGLEPUNK_SIZE / 3}rem;
  left: ${SNUGGLEPUNK_SIZE / 3}rem;

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

  width: 100%;
  height: ${SNUGGLEPUNK_SIZE}rem;

  padding-right: ${SNUGGLEPUNK_SIZE / 3}rem;
  padding-left: ${SNUGGLEPUNK_SIZE / 3}rem;

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
