import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles, {
  DEFAULT_SCHEME,
  SCHEME_ALTERNATE,
} from '~/client/styles/variables';
import {
  HeadingPrimaryStyle,
  HeadingSecondaryStyle,
  ParagraphStyle,
} from '~/client/styles/typography';
import { BackgroundAreaStyle } from '~/client/styles/layout';
import {
  ButtonIconSVGStyle,
  ButtonIconStyle,
} from '~/client/components/ButtonIcon';
import { ButtonMoreStyle } from '~/client/components/ButtonMore';
import { ButtonOutlineStyle } from '~/client/components/ButtonOutline';
import { BoxFramedCornerStyle } from '~/client/components/BoxFramed';
import { HorizontalLineStyle } from '~/client/components/HorizontalLine';
import {
  EthereumContainerStyle,
  EthereumContainerInnerStyle,
} from '~/client/components/EthereumContainer';
import {
  BoxRoundedStyle,
  BoxRoundedInnerStyle,
} from '~/client/components/BoxRounded';
import {
  BoothContainerStyle,
  BoothContainerInnerStyle,
} from '~/client/components/BoothContainer';
import { InputFieldStyle } from '~/client/components/InputField';
import { InputFieldsetLabelStyle } from '~/client/components/InputFieldset';
import { InputTextareaFieldStyle } from '~/client/components/InputTextareaField';
import { PaperStyle } from '~/client/components/Paper';
import { PillStyle } from '~/client/components/Pill';

const ColorSection = ({ scheme = DEFAULT_SCHEME, ...props }) => {
  const { isAlternateColor, isAlternateFontFace, isLargerFont } = useSelector(
    (state) => state.app,
  );

  return (
    <ColorSectionStyle
      isAlternateColor={isAlternateColor}
      isAlternateFontFace={isAlternateFontFace}
      isInverted={props.isInverted}
      isLargerFont={isLargerFont}
      scheme={isAlternateColor ? SCHEME_ALTERNATE : scheme}
    >
      {props.children}
    </ColorSectionStyle>
  );
};

export const ColorSectionStyle = styled.div`
  ${/* sc-selector */ BoothContainerInnerStyle},
  ${/* sc-selector */ BoothContainerStyle},
  ${/* sc-selector */ BoxRoundedInnerStyle},
  ${/* sc-selector */ BoxRoundedStyle},
  ${/* sc-selector */ ButtonIconStyle},
  ${/* sc-selector */ ButtonOutlineStyle},
  ${/* sc-selector */ EthereumContainerStyle},
  ${/* sc-selector */ HeadingPrimaryStyle},
  ${/* sc-selector */ HeadingSecondaryStyle},
  ${/* sc-selector */ InputFieldStyle},
  ${/* sc-selector */ InputFieldsetLabelStyle},
  ${/* sc-selector */ InputTextareaFieldStyle},
  ${/* sc-selector */ ParagraphStyle} {
    color: ${(props) => {
      const { foreground, background } = styles.schemes[props.scheme];
      return props.isInverted ? background : foreground;
    }};

    font-family: ${(props) => {
      return props.isAlternateFontFace
        ? styles.typography.familyAccessible
        : null;
    }};
  }

  ${/* sc-selector */ ButtonIconStyle},
  ${/* sc-selector */ ButtonOutlineStyle},
  ${/* sc-selector */ InputFieldStyle},
  ${/* sc-selector */ InputFieldsetLabelStyle},
  ${/* sc-selector */ InputTextareaFieldStyle},
  ${/* sc-selector */ ParagraphStyle} {
    font-size: ${(props) => {
      return props.isLargerFont ? '1.5em' : null;
    }};
  }

  ${/* sc-selector */ HeadingPrimaryStyle} {
    font-size: ${(props) => {
      return props.isLargerFont ? '6em' : null;
    }};
  }

  ${/* sc-selector */ HeadingSecondaryStyle} {
    font-size: ${(props) => {
      return props.isLargerFont ? '2.5em' : null;
    }};
  }

  ${/* sc-selector */ BackgroundAreaStyle} {
    background-color: ${(props) => {
      const { foreground, background } = styles.schemes[props.scheme];
      return props.isInverted ? foreground : background;
    }};
  }

  ${/* sc-selector */ PaperStyle},
  ${/* sc-selector */ PillStyle} {
    background-color: ${(props) => {
      const { background } = styles.schemes[props.scheme];
      return props.isAlternateColor ? background : null;
    }};
  }

  ${/* sc-selector */ ButtonIconSVGStyle},
  ${/* sc-selector */ BoxFramedCornerStyle} {
    g,
    path {
      stroke: ${(props) => {
        const { foreground, background } = styles.schemes[props.scheme];
        return props.isInverted ? background : foreground;
      }};
    }
  }

  ${/* sc-selector */ ButtonMoreStyle},
  ${/* sc-selector */ HorizontalLineStyle} {
    g {
      fill: ${(props) => {
        const { foreground, background } = styles.schemes[props.scheme];
        return props.isInverted ? background : foreground;
      }};
    }
  }

  ${/* sc-selector */ BoothContainerInnerStyle},
  ${/* sc-selector */ BoothContainerStyle},
  ${/* sc-selector */ BoxRoundedInnerStyle},
  ${/* sc-selector */ BoxRoundedStyle},
  ${/* sc-selector */ ButtonIconSVGStyle},
  ${/* sc-selector */ ButtonIconStyle},
  ${/* sc-selector */ ButtonOutlineStyle},
  ${/* sc-selector */ EthereumContainerInnerStyle},
  ${/* sc-selector */ EthereumContainerStyle},
  ${/* sc-selector */ InputFieldStyle},
  ${/* sc-selector */ InputTextareaFieldStyle},
  ${/* sc-selector */ PillStyle} {
    border-color: ${(props) => {
      const { foreground, background } = styles.schemes[props.scheme];
      return props.isInverted ? background : foreground;
    }};
  }
`;

ColorSection.propTypes = {
  children: PropTypes.node,
  isInverted: PropTypes.bool,
  scheme: PropTypes.oneOf(Object.keys(styles.schemes)),
};

export default ColorSection;
