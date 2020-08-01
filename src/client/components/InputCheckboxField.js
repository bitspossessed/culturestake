import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import InputFieldset from '~/client/components/InputFieldset';
import styles from '~/client/styles/variables';
import { useField } from '~/client/hooks/forms';

// eslint-disable-next-line react/display-name
const InputCheckBoxField = React.forwardRef(
  ({ name, validate, label }, ref) => {
    const { meta, value, setValue } = useField(name, {
      validate,
      type: 'checkbox',
    });

    const onChange = () => {
      setValue((value) => !value);
    };

    return (
      <InputFieldset label={label} meta={meta} name={name}>
        <InputCheckBoxStyle checked={value} ref={ref} onClick={onChange} />
      </InputFieldset>
    );
  },
);

export const InputCheckBoxStyle = styled.div`
  display: block;

  width: 2rem;
  height: 2rem;

  border: 1.5px solid ${styles.colors.violet};

  background-color: ${(props) =>
    props.checked ? styles.colors.violet : 'transparent'};

  cursor: pointer;

  appearance: none;
`;

InputCheckBoxField.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputCheckBoxField;
