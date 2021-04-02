import PropTypes from 'prop-types';
import React, { Suspense, useMemo } from 'react';
import styled from 'styled-components';
import { Group } from 'react-three-fiber/components';
import { useThree } from 'react-three-fiber';

import ColorSection from '~/client/components/ColorSection';
import ThreeButtonLogo from '~/client/components/ThreeButtonLogo';
import ThreeCanvas from '~/client/components/ThreeCanvas';
import ThreeRotator from '~/client/components/ThreeRotator';
import styles, {
  SCHEME_ALTERNATE,
  SCHEME_BLACK,
} from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { HeadingPrimaryStyle } from '~/client/styles/typography';
import { randomRange, randomRangeFloat } from '~/common/utils/random';
import { useScheme } from '~/client/hooks/scheme';

const ICONS_COUNT = 16;
const ICONS_SCALE = 3;

const ThreeSplash = () => {
  const { isAlternateColor } = useScheme();

  return (
    <ThreeSplashStyle>
      <ThreeCanvas
        camera={{ far: ICONS_COUNT * 250 }}
        isDimmed={isAlternateColor}
      >
        <Suspense fallback={null}>
          <ThreeSplashLogos isAlternateColor={isAlternateColor} />
        </Suspense>
      </ThreeCanvas>

      <ThreeSplashTitleContainerStyle>
        <ColorSection scheme={SCHEME_BLACK}>
          <ThreeSplashTitleStyle isAlternateColor={isAlternateColor}>
            {translate('title')}
          </ThreeSplashTitleStyle>
        </ColorSection>
      </ThreeSplashTitleContainerStyle>
    </ThreeSplashStyle>
  );
};

const ThreeSplashLogos = (props) => {
  const { size } = useThree();

  return useMemo(() => {
    const { width, height } = size;

    return new Array(ICONS_COUNT).fill().map((logo, index) => {
      const randomPosition = [
        randomRange(-width / 2, width / 2),
        randomRange(-height / 2, height / 2),
        -index * 100,
      ];

      const randomRotation = [
        randomRange(3, 4),
        randomRangeFloat(-1, 1),
        randomRangeFloat(-0.5, 0.5),
      ];

      return (
        <Group
          key={index}
          position={randomPosition}
          rotation={randomRotation}
          scale={[ICONS_SCALE, ICONS_SCALE, ICONS_SCALE]}
        >
          <ThreeRotator>
            <ThreeButtonLogo isAlternateColor={props.isAlternateColor} />
          </ThreeRotator>
        </Group>
      );
    });
  }, [props.isAlternateColor]); // eslint-disable-line react-hooks/exhaustive-deps
};

ThreeSplashLogos.propTypes = {
  isAlternateColor: PropTypes.bool,
};

const ThreeSplashStyle = styled.div`
  position: relative;

  height: 80%;
`;

const ThreeSplashTitleStyle = styled(HeadingPrimaryStyle)`
  @media ${styles.media.tablet} {
    font-size: 11em;
  }

  @media ${styles.media.laptop} {
    font-size: 18em;
  }

  @media ${styles.media.desktop} {
    font-size: 23em;
  }

  background-color: ${(props) => {
    return props.isAlternateColor
      ? styles.schemes[SCHEME_ALTERNATE].background
      : 'transparent';
  }};

  font-size: 6em;

  line-height: 1;
`;

const ThreeSplashTitleContainerStyle = styled.div`
  position: absolute;

  top: 50%;
  left: 50%;

  width: 100%;

  text-align: center;
  text-transform: uppercase;

  transform: translate3d(-50%, -50%, 0);

  pointer-events: none;
`;

export default ThreeSplash;
