import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'react-form';

import {
  InputSelectFieldInnerStyle,
  InputSelectFieldStyle,
} from '~/client/components/InputSelectField';

const InputSelectAnswerTypeField = (props) => {
  const [type, setType] = useState('artwork');
  const { meta, setValue } = useField(props.name);

  const possibleTypes = ['artwork', 'property'];

  const onChange = (event) => {
    event.preventDefault();
    setType(event.target.value);
    setValue(event.target.value);
  };

  return (
    <InputSelectFieldStyle meta={meta} name="type">
      <InputSelectFieldInnerStyle
        name="type"
        value={type}
        onChange={onChange}
      >
        {possibleTypes.map((value) => {
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </InputSelectFieldInnerStyle>
    </InputSelectFieldStyle>
  );
};

InputSelectAnswerTypeField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default InputSelectAnswerTypeField;
