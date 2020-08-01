import React from 'react';
import styled from 'styled-components';

import BoxFramed from '~/client/components/BoxFramed';
import ColorSection from '~/client/components/ColorSection';
import HorizontalLine from '~/client/components/HorizontalLine';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { ContainerStyle, HorizontalSpacingStyle } from '~/client/styles/layout';
import {
  ParagraphStyle,
  HeadingSecondaryStyle,
  HeadingPrimaryStyle,
} from '~/client/styles/typography';
import { useScheme } from '~/client/hooks/scheme';

const Instructions = () => {
  const { scheme } = useScheme();

  return (
    <InstructionsStyle scheme={scheme}>
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

  background-color: ${(props) => styles.schemes[props.scheme].background};
`;

export default Instructions;
