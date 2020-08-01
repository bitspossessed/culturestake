import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import { useScheme } from '~/client/hooks/scheme';

const Legend = (props) => {
  const { scheme, isLargerFont } = useScheme(props.scheme);

  return (
    <LegendStyle>
      <LegendBoxStyle scheme={scheme} />

      <LegendLabelStyle isLargerFont={isLargerFont} scheme={scheme}>
        {props.title}
      </LegendLabelStyle>
    </LegendStyle>
  );
};

export const LegendStyle = styled.div`
  display: flex;

  align-items: center;
`;

export const LegendBoxStyle = styled.div`
  width: 1rem;
  height: 1rem;

  margin-right: 0.5rem;

  background-color: ${(props) => styles.schemes[props.scheme].foreground};
`;

export const LegendLabelStyle = styled.p`
  color: ${(props) => styles.schemes[props.scheme].foreground};

  font-size: ${(props) => (props.isLargerFont ? '1em' : '0.7em')};
`;

Legend.propTypes = {
  scheme: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Legend;
