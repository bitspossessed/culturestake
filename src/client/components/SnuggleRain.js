import AnimationFrame from 'animation-frame';
import PropTypes from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { ResizeObserver } from '@juggle/resize-observer';

import styles from '~/client/styles/variables';
import { SNUGGLEPUNKS_COUNT } from '~/client/components/SVGDefinitions';
import { randomRange } from '~/common/utils/random';

const SNUGGLEPUNK_SIZE = 8;

const FRAME_RATE = 10;
const MAX_PARTICLES = 8;
const VISIBLE_AREA_OFFSET = 150;

const FALLING_SPEED_MAX = 30;
const FALLING_SPEED_MIN = 30;
const SWINGING_DENSITY_MAX = 30;
const SWINGING_DENSITY_MIN = 5;
const SWINGING_SPEED_MAX = 10;
const SWINGING_SPEED_MIN = 5;

const particles = new Array(MAX_PARTICLES).fill(0).map((particle, index) => ({
  id: index,
  x: 0,
  y: -VISIBLE_AREA_OFFSET,
  fallingSpeed: 0,
  swingingDensity: 0,
  swingingSpeed: 0,
  isActive: false,
  isHidden: true,
  snuggleness: 0.0,
}));

let isFirstRequest = true;
let isCheckingElements = true;
let isRequestingSnugglepunk = false;
let snuggleness = 0.0;

function renderParticle(particle) {
  if (isCheckingElements) {
    particle.elem = document.getElementById(`particle-${particle.id}`);
    particle.useElem = document.getElementById(`particle-use-${particle.id}`);
  }

  // Update element styles (outside of React for performance reasons)
  if (particle.elem) {
    particle.elem.style.opacity = particle.isHidden ? 0 : 1;
    particle.elem.style.transitionDuration = particle.isHidden ? '0s' : '1s';
    particle.elem.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0)`;
  }

  if (particle.useElem) {
    const svgId =
      Math.round(particle.snuggleness * (SNUGGLEPUNKS_COUNT - 1)) + 1;
    particle.useElem.setAttribute('xlink:href', `#snugglepunk-${svgId}`);
  }
}

function resetParticle(particle) {
  particle.y = -VISIBLE_AREA_OFFSET;
  particle.fallingSpeed = 0;
  particle.swingingSpeed = 0;
  particle.swingingDensity = 0;
  particle.isActive = false;
  particle.isHidden = true;
}

function updateParticles(frameIndex, dimensions) {
  particles.forEach((particle) => {
    if (!particle.isActive && isRequestingSnugglepunk && snuggleness > 0.5) {
      // Spawn a snugglepunk!
      particle.x =
        (dimensions.width / particles.length) *
        randomRange(0, particles.length);
      particle.isActive = true;
      particle.snuggleness = snuggleness;
      particle.fallingSpeed = randomRange(FALLING_SPEED_MIN, FALLING_SPEED_MAX);

      particle.swingingSpeed = randomRange(
        SWINGING_SPEED_MIN,
        SWINGING_SPEED_MAX,
      );

      particle.swingingDensity = randomRange(
        SWINGING_DENSITY_MIN,
        SWINGING_DENSITY_MAX,
      );

      // Turn off the flag to launch a new one. It can be activated again by
      // the user, the more often this happens the more snugglepunks we will
      // spawn (= intensity)
      isRequestingSnugglepunk = false;
    }

    if (particle.isActive) {
      // Calculate how much the Snugglepunks should swing and fall
      const swingingFactor =
        ((frameIndex % (particle.swingingSpeed * 2)) / particle.swingingSpeed) *
        Math.PI;

      particle.x += Math.sin(swingingFactor) * particle.swingingDensity;
      particle.y += particle.fallingSpeed;

      // Add some noise
      particle.x += randomRange(-1, 1);
      particle.y += randomRange(-1, 1);

      // Hide punks when reaching the end of the view so they can secretly
      // fly up again
      particle.isHidden =
        particle.y < -VISIBLE_AREA_OFFSET ||
        particle.y > dimensions.height + VISIBLE_AREA_OFFSET * 2;

      if (particle.y > dimensions.height + VISIBLE_AREA_OFFSET * 2) {
        particle.y = -VISIBLE_AREA_OFFSET;
        particle.isActive = false;
      }
    }

    renderParticle(particle);
  });

  isCheckingElements = false;
}

const SnuggleRain = (props) => {
  useEffect(() => {
    return () => {
      isFirstRequest = true;
      isCheckingElements = true;

      particles.forEach((particle) => {
        resetParticle(particle);
        renderParticle(particle);
      });
    };
  }, []);

  useEffect(() => {
    if (isFirstRequest) {
      isFirstRequest = false;
    } else {
      isRequestingSnugglepunk = true;
      snuggleness = props.snuggleness;
    }
  }, [props]);

  return (
    <SnuggleRainStyle>
      <SnuggleRainParticles />
    </SnuggleRainStyle>
  );
};

const SnuggleRainParticles = () => {
  useEffect(() => {
    const animationFrameHandler = new AnimationFrame(FRAME_RATE);

    const dimensions = {
      width: document.body.offsetWidth,
      height: document.body.offsetHeight,
    };

    let frameIndex = 0;
    let rafRequestId;

    const nextFrame = () => {
      updateParticles(frameIndex, dimensions);
      frameIndex += 1;
      rafRequestId = animationFrameHandler.request(nextFrame);
    };

    nextFrame();

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      dimensions.width = width;
      dimensions.height = height;
    });

    resizeObserver.observe(document.body);

    return () => {
      animationFrameHandler.cancel(rafRequestId);
      resizeObserver.disconnect();
    };
  }, []);

  return useMemo(() => {
    return particles.map(({ id }) => {
      return (
        <SnuggleRainParticleStyle id={`particle-${id}`} key={id}>
          <use id={`particle-use-${id}`} xlinkHref="#snugglepunk-1" />
        </SnuggleRainParticleStyle>
      );
    });
  }, []);
};

SnuggleRain.propTypes = {
  snuggleness: PropTypes.number.isRequired,
};

const SnuggleRainStyle = styled.div`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.layers.SnuggleRain};

  overflow: hidden;

  user-select: none;

  pointer-events: none;
`;

const SnuggleRainParticleStyle = styled.svg`
  position: absolute;

  top: 0;
  left: 0;

  width: ${SNUGGLEPUNK_SIZE}rem;
  height: ${SNUGGLEPUNK_SIZE}rem;

  opacity: 0;

  transition: transform 1s linear;
`;

export default SnuggleRain;
