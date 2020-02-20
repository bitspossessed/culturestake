import PropTypes from 'prop-types';
import React from 'react';

import { useField } from '~/client/hooks/forms';

// eslint-disable-next-line react/display-name
const InputField = React.forwardRef(
  ({ name, validate, label, ...rest }, ref) => {
    const { meta, getInputProps } = useField(name, { validate });
    const { error, isTouched } = meta;

    return (
      <fieldset>
        <label htmlFor={name}>{label}</label>

        {isTouched && error ? (
          <p>
            <em>{error}</em>
          </p>
        ) : null}

        <input {...getInputProps({ ref, id: name, ...rest })} ref={ref} />
      </fieldset>
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
