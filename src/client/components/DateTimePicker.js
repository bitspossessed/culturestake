import React from 'react';
import ReactDateTimePicker from 'react-datetime-picker';
import styled from 'styled-components';

import styles from '~/client/styles/variables';

const DateTimePicker = (props) => {
  return <DateTimePickerStyle {...props} />;
};

const DateTimePickerStyle = styled(ReactDateTimePicker)`
  display: block;

  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  border: 1.5px solid ${styles.colors.violet};

  color: ${styles.colors.violet};

  font-family: ${styles.typography.family}, sans-serif;

  .react-datetime-picker__wrapper {
    border: none;
  }

  button,
  select,
  input,
  .react-datetime-picker__inputGroup__leadingZero {
    color: ${styles.colors.violet};
  }

  .react-calendar {
    border: 1.5px solid ${styles.colors.violet};

    color: ${styles.colors.violet};

    font-family: ${styles.typography.family}, sans-serif;
  }

  .react-calendar__tile {
    background-color: ${styles.colors.white};

    &:hover {
      background-color: ${styles.colors.gray};
    }
  }

  .react-clock__face {
    border-color: ${styles.colors.violet};
  }

  .react-clock__hand__body,
  .react-clock__mark__body {
    background-color: ${styles.colors.violet};
  }

  .react-datetime-picker__clock {
    border: 1.5px solid ${styles.colors.violet};
  }

  .react-calendar__tile--active,
  .react-calendar__tile--hasActive {
    color: ${styles.colors.white};

    background-color: ${styles.colors.violet};

    &:hover {
      background-color: ${styles.colors.violet};
    }
  }

  select {
    appearance: none;
  }

  svg {
    stroke: ${styles.colors.violet};
  }
`;

export default DateTimePicker;
