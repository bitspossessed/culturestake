import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useField } from 'react-form';

import InputFieldset from '~/client/components/InputFieldset';
import styles from '~/client/styles/variables';
import InputHiddenField from '~/client/components/InputHiddenField';

const DisabledFinder = (props) => {
  const { meta } = useField(props.name);

  return (
    <Fragment>
      <InputFieldset label={props.label} meta={meta} name={props.name}>
        <TextFieldStyle>{props.contents}</TextFieldStyle>
        <InputHiddenField
          label={props.label}
          name={props.name}
          value={{ value: props.value }}
        />
      </InputFieldset>
    </Fragment>
  );
};

DisabledFinder.propTypes = {
  contents: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export const TextFieldStyle = styled.p`
  width: 100%;

  padding: 1rem;

  border: 1.5px solid ${styles.colors.gray};
  border-radius: 20px;

  color: ${styles.colors.gray};

  background-color: transparent;
`;

export default DisabledFinder;
