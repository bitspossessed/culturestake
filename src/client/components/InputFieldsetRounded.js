import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import BoxRounded from '~/client/components/BoxRounded';
import styles from '~/client/styles/variables';

const InputFieldsetRounded = ({ children, label, meta }) => {
  return (
    <BoxRounded title={label}>
      {meta.isTouched && meta.error ? (
        <InputFieldsetRoundedErrorStyle>
          {meta.error}
        </InputFieldsetRoundedErrorStyle>
      ) : null}

      {children}
    </BoxRounded>
  );
};

const InputFieldsetRoundedErrorStyle = styled.p`
  margin-bottom: 1rem;
  padding: 0.5rem;
  padding-left: 0.8rem;

  border-radius: 10px;

  color: ${styles.colors.white};

  background-color: ${styles.colors.red};

  font-size: 0.8em;
`;

InputFieldsetRounded.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default InputFieldsetRounded;
