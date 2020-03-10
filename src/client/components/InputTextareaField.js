import PropTypes from 'prop-types';
import React from 'react';

import InputFieldset from '~/client/components/InputFieldset';
import { useField } from '~/client/hooks/forms';

// eslint-disable-next-line react/display-name
const InputTextareaField = React.forwardRef(
  ({ name, validate, label, value, ...rest }, ref) => {
    const { meta, getInputProps } = useField(name, { validate });
    return (
      <InputFieldset label={label} meta={meta} name={name}>
        <textarea {...getInputProps({ ref, id: name, ...rest })} ref={ref}>
          {value}
        </textarea>
      </InputFieldset>
    );
  },
);

InputTextareaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputTextareaField;
