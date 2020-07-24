import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

import styles from '~/client/styles/variables';

const Scanner = ({ onDetected, onError }) => {
  const ref = useRef();

  useEffect(() => {
    let scanner;

    const initialize = async () => {
      try {
        scanner = new BrowserMultiFormatReader();

        const devices = await scanner.getVideoInputDevices();

        scanner.decodeFromVideoDevice(
          devices[0].deviceId,
          ref.current,
          (result, error) => {
            if (result) {
              onDetected(result.text);
            }

            if (error && !(error instanceof NotFoundException)) {
              throw error;
            }
          },
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        if (onError) {
          onError(error);
        }
      }
    };

    initialize();

    return () => {
      if (scanner) {
        scanner.reset();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <ScannerStyle ref={ref} />;
};

const ScannerStyle = styled.video`
  max-width: 40rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 5px;
`;

Scanner.propTypes = {
  onDetected: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

export default Scanner;
