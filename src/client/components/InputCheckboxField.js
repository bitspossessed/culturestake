import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import InputFieldset from '~/client/components/InputFieldset';
import { useField } from '~/client/hooks/forms';

// eslint-disable-next-line react/display-name
const InputCheckBoxField = React.forwardRef(
  ({ name, validate, label, ...rest }, ref) => {
    const { meta, getInputProps, setValue } = useField(name, {
      validate,
      type: 'checkbox',
    });

    const onChange = () => {
      event.preventDefault();
      setValue(event.target.checked);
    };

    return (
      <InputFieldset label={label} meta={meta} name={name}>
        <InputCheckBoxStyle
          {...getInputProps({ ref, id: name, ...rest })}
          ref={ref}
          onChange={onChange}
        />
      </InputFieldset>
    );
  },
);

export const InputCheckBoxStyle = styled.input.attrs({ type: 'checkbox' })`
  display: block;
`;

InputCheckBoxField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputCheckBoxField;
