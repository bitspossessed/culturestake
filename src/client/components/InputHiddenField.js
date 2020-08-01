import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useField } from 'react-form';

const InputHiddenField = (props) => {
  const { setValue } = useField(props.name);

  useEffect(() => {
    setValue(props.value.value);
  }, [props.value.value, setValue]);

  return <input type="hidden" />;
};

InputHiddenField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
};

export default InputHiddenField;
