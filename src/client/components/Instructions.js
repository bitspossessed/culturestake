import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import BoxFramed from '~/client/components/BoxFramed';
import ColorSection from '~/client/components/ColorSection';
import HorizontalLine from '~/client/components/HorizontalLine';
import styles, {
  DEFAULT_SCHEME,
  SCHEME_ALTERNATE,
} from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { ContainerStyle, HorizontalSpacingStyle } from '~/client/styles/layout';
import {
  ParagraphStyle,
  HeadingSecondaryStyle,
  HeadingPrimaryStyle,
} from '~/client/styles/typography';

const Instructions = () => {
  const { isAlternateColor } = useSelector((state) => state.app);

  return (
    <InstructionsStyle isAlternateColor={isAlternateColor}>
      <ColorSection>
        <ContainerStyle>
          <BoxFramed>
            <HeadingPrimaryStyle>
              {translate('Instructions.title')}
            </HeadingPrimaryStyle>
          </BoxFramed>

          <HorizontalSpacingStyle />

          <HeadingSecondaryStyle>
            {translate('Instructions.titleStepOne')}
          </HeadingSecondaryStyle>

          <ParagraphStyle>
            {translate('Instructions.bodyStepOne')}
          </ParagraphStyle>

          <HorizontalLine />

          <HeadingSecondaryStyle>
            {translate('Instructions.titleStepTwo')}
          </HeadingSecondaryStyle>

          <ParagraphStyle>
            {translate('Instructions.bodyStepTwo')}
          </ParagraphStyle>

          <HorizontalLine />

          <HeadingSecondaryStyle>
            {translate('Instructions.titleStepThree')}
          </HeadingSecondaryStyle>

          <ParagraphStyle>
            {translate('Instructions.bodyStepThree')}
          </ParagraphStyle>
        </ContainerStyle>
      </ColorSection>
    </InstructionsStyle>
  );
};

const InstructionsStyle = styled.div`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.layers.Instructions};

  overflow-x: hidden;
  overflow-y: auto;

  background-color: ${(props) => {
    return props.isAlternateColor
      ? styles.schemes[SCHEME_ALTERNATE].background
      : styles.schemes[DEFAULT_SCHEME].background;
  }};
`;

export default Instructions;
