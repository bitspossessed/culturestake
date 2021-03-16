import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import InputFieldset from '~/client/components/InputFieldset';
import styles from '~/client/styles/variables';
import { useField } from '~/client/hooks/forms';

// eslint-disable-next-line react/display-name
const InputTextareaField = React.forwardRef(
  ({ name, validate, label, value, ...rest }, ref) => {
    const { meta, getInputProps } = useField(name, { validate });
    return (
      <InputFieldset label={label} meta={meta} name={name}>
        <InputTextareaFieldStyle
          {...getInputProps({ ref, id: name, ...rest })}
          ref={ref}
        >
          {value}
        </InputTextareaFieldStyle>
      </InputFieldset>
    );
  },
);

export const InputTextareaFieldStyle = styled.textarea`
  width: 100%;
  min-width: 100%;
  max-width: 100%;

  padding: 1rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 20px;

  color: ${styles.colors.violet};

  background-color: transparent;

  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
`;

InputTextareaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputTextareaField;
