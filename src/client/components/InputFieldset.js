import PropTypes from 'prop-types';
import React from 'react';

const InputFieldset = ({ children, name, label, meta }) => {
  return (
    <fieldset>
      <label htmlFor={name}>{label}</label>

      {meta.isTouched && meta.error ? (
        <p>
          <em>{meta.error}</em>
        </p>
      ) : null}

      {children}
    </fieldset>
  );
};

InputFieldset.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default InputFieldset;
