import PropTypes from 'prop-types';
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useDispatch } from 'react-redux';

import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import ColorSection from '~/client/components/ColorSection';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { ParagraphStyle } from '~/client/styles/typography';
import { SpacingGroupStyle } from '~/client/styles/layout';

const Scanner = ({ onDetected, onError }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let scanner;

    const initialize = async () => {
      try {
        scanner = new BrowserMultiFormatReader();

        const devices = await scanner.getVideoInputDevices();
        if (devices.length === 0) {
          throw new Error('No devices found');
        }

        if (!ref.current) {
          return;
        }

        scanner.decodeFromVideoDevice(
          undefined,
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

        setIsReady(true);
      } catch (error) {
        dispatch(
          notify({
            text: translate('Scanner.notificationError', {
              error: error.message || 'Undefined error',
            }),
            type: NotificationsTypes.ERROR,
          }),
        );

        setIsError(true);

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

  return (
    !isError && (
      <ScannerStyle isReady={isReady}>
        <SpacingGroupStyle>
          <ScannerVideoStyle ref={ref} />

          <ColorSection>
            <ParagraphStyle>
              {translate('Scanner.bodyDescription')}
            </ParagraphStyle>
          </ColorSection>
        </SpacingGroupStyle>
      </ScannerStyle>
    )
  );
};

const ScannerStyle = styled.div`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.layers.Scanner};

  display: flex;

  background-color: rgba(255, 255, 255, 0.1);

  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const ScannerVideoStyle = styled.video`
  width: 100%;
  max-width: 40rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 5px;

  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 3px,
    ${styles.colors.violet} 3px,
    ${styles.colors.violet} 6px
  );
`;

Scanner.propTypes = {
  onDetected: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

export default Scanner;
