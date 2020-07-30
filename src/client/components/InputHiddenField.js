import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'react-form';
import styled from 'styled-components';

const InputHiddenField = (props) => {
  const { setValue } = useField(props.name);
  useEffect(() => {
    setValue(props.value.value);
  }, [props.value.value, setValue]);

  return <InputHiddenFieldStyle />;
};

export const InputHiddenFieldStyle = styled.input`
  visibility: hidden;
`;

InputHiddenField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
};

export default InputHiddenField;
