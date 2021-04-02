import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { ButtonIconStyle } from '~/client/components/ButtonIcon';

const ButtonGroup = (props) => {
  return <ButtonGroupStyle>{props.children}</ButtonGroupStyle>;
};

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
};

export const ButtonGroupStyle = styled.div`
  ${/* sc-selector */ ButtonIconStyle} {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  a:first-child {
    ${/* sc-selector */ ButtonIconStyle} {
      margin-top: 2rem;
    }
  }

  a:last-child {
    ${/* sc-selector */ ButtonIconStyle} {
      margin-bottom: 2rem;
    }
  }
`;

export default ButtonGroup;
