import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import InputFieldset from '~/client/components/InputFieldset';
import { useField } from '~/client/hooks/forms';

// eslint-disable-next-line react/display-name
const InputCheckBoxField = React.forwardRef(
  ({ name, validate, label, ...rest }, ref) => {
    const { meta, getInputProps, value, setValue } = useField(name, {
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
          checked={value}
          ref={ref}
          onChange={onChange}
        />
      </InputFieldset>
    );
  },
);

export const InputCheckBoxStyle = styled.input.attrs((props) => ({
  checked: props.value,
  type: 'checkbox',
}))`
  display: block;
`;

InputCheckBoxField.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputCheckBoxField;
