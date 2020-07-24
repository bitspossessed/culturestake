import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import InputFieldset from '~/client/components/InputFieldset';
import { useField } from '~/client/hooks/forms';
import styles from '~/client/styles/variables';

// eslint-disable-next-line react/display-name
const InputSelectField = React.forwardRef(
  ({ name, validate, label, children, ...rest }, ref) => {
    const { meta, getInputProps } = useField(name, { validate });
    return (
      <InputFieldset label={label} meta={meta} name={name}>
        <InputSelectFieldStyle>
          <InputSelectFieldInnerStyle
            {...getInputProps({ ref, id: name, ...rest })}
            ref={ref}
          >
            {children}
          </InputSelectFieldInnerStyle>
        </InputSelectFieldStyle>
      </InputFieldset>
    );
  },
);

export const InputSelectFieldStyle = styled.div`
  position: relative;

  &::after {
    position: absolute;

    top: 0;
    right: 0;

    display: block;

    padding: 1rem;

    content: '▼';

    color: ${styles.colors.violet};

    pointer-events: none;
  }
`;

export const InputSelectFieldInnerStyle = styled.select`
  display: block;

  padding: 1rem;
  padding-right: 2rem;

  border: 1.5px solid ${styles.colors.violet};

  color: ${styles.colors.violet};

  background-color: transparent;

  appearance: none;

  cursor: pointer;
`;

InputSelectField.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputSelectField;
