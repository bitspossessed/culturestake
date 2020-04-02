import PropTypes from 'prop-types';
import React from 'react';

import InputFieldset from '~/client/components/InputFieldset';
import { useField } from '~/client/hooks/forms';

// eslint-disable-next-line react/display-name
const InputField = React.forwardRef(
  ({ name, validate, label, ...rest }, ref) => {
    const { meta, getInputProps } = useField(name, { validate });

    return (
      <InputFieldset label={label} meta={meta} name={name}>
        <input {...getInputProps({ ref, id: name, ...rest })} ref={ref} />
      </InputFieldset>
    );
  },
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputField;
