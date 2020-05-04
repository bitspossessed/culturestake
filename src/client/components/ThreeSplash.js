import React, { Suspense, useMemo } from 'react';
import styled from 'styled-components';
import { Group } from 'react-three-fiber/components';
import { useThree } from 'react-three-fiber';

import ColorSection, { SCHEME_BLACK } from '~/client/components/ColorSection';
import ThreeButtonLogo from '~/client/components/ThreeButtonLogo';
import ThreeCanvas from '~/client/components/ThreeCanvas';
import ThreeRotator from '~/client/components/ThreeRotator';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { HeadingPrimaryStyle } from '~/client/styles/typography';
import { randomRange, randomRangeFloat } from '~/common/utils/random';

const ICONS_COUNT = 16;
const ICONS_SCALE = 3;

const ThreeSplash = () => {
  return (
    <ThreeSplashStyle>
      <ThreeCanvas camera={{ far: ICONS_COUNT * 250 }}>
        <Suspense fallback={null}>
          <ThreeSplashLogos />
        </Suspense>
      </ThreeCanvas>

      <ThreeSplashTitleContainerStyle>
        <ColorSection scheme={SCHEME_BLACK}>
          <ThreeSplashTitleStyle>{translate('title')}</ThreeSplashTitleStyle>
        </ColorSection>
      </ThreeSplashTitleContainerStyle>
    </ThreeSplashStyle>
  );
};

const ThreeSplashLogos = () => {
  const { size } = useThree();
  const { width, height } = size;

  return useMemo(() => {
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
          <ThreeRotator rotation={[0, 0, 0]}>
            <ThreeButtonLogo />
          </ThreeRotator>
        </Group>
      );
    });
  }, [width, height]);
};

const ThreeSplashStyle = styled.div`
  position: relative;

  height: 80%;
`;

const ThreeSplashTitleStyle = styled(HeadingPrimaryStyle)`
  @media ${styles.media.desktop} {
    font-size: 12em;
  }

  font-size: 4em;
`;

const ThreeSplashTitleContainerStyle = styled.div`
  position: absolute;

  top: 50%;
  left: 50%;

  line-height: 1;

  text-align: center;
  text-transform: uppercase;

  transform: translate3d(-50%, -50%, 0);

  pointer-events: none;
`;

export default ThreeSplash;
