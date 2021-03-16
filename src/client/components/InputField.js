import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import InputFieldset from '~/client/components/InputFieldset';
import { useField } from '~/client/hooks/forms';
import styles from '~/client/styles/variables';

// eslint-disable-next-line react/display-name
const InputField = React.forwardRef(
  ({ name, validate, label, ...rest }, ref) => {
    const { meta, getInputProps } = useField(name, { validate });

    return (
      <InputFieldset label={label} meta={meta} name={name}>
        <InputFieldStyle
          {...getInputProps({ ref, id: name, ...rest })}
          ref={ref}
        />
      </InputFieldset>
    );
  },
);

export const InputFieldStyle = styled.input`
  width: 100%;

  padding: 1rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 20px;

  color: ${styles.colors.violet};

  background-color: transparent;

  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
`;

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputField;
