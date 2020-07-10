import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';

const InputFieldset = ({ children, name, label, meta }) => {
  return (
    <InputFieldsetStyle>
      <InputFieldsetLabelStyle htmlFor={name}>{label}</InputFieldsetLabelStyle>

      {meta.isTouched && meta.error ? (
        <InputFieldsetErrorStyle>{meta.error}</InputFieldsetErrorStyle>
      ) : null}

      {children}
    </InputFieldsetStyle>
  );
};

const InputFieldsetStyle = styled.fieldset`
  margin-bottom: 1rem;
  padding: 0;

  border: 0;

  & + & {
    margin-top: 3rem;
  }
`;

const InputFieldsetLabelStyle = styled.label`
  display: block;

  margin-bottom: 1rem;

  color: ${styles.colors.violet};
`;

const InputFieldsetErrorStyle = styled.p`
  margin-bottom: 1rem;
  padding: 0.5rem;
  padding-left: 0.8rem;

  border-radius: 10px;

  color: ${styles.colors.white};

  background-color: ${styles.colors.red};

  font-size: 0.8em;
`;

InputFieldset.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default InputFieldset;
