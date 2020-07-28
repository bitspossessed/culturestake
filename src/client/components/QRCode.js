import PropTypes from 'prop-types';
import QRCodeGenerator from 'qrcode';
import React, { createRef, useEffect } from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';

const QR_CODE_SIZE = 320;

const QRCode = (props) => {
  const ref = createRef();

  const generateQRCode = () => {
    const options = {
      margin: 0,
      scale: props.scale || null,
      width: QR_CODE_SIZE,
    };

    QRCodeGenerator.toCanvas(ref.current, props.data, options);
  };

  useEffect(generateQRCode, [props.data, ref, props.scale]);

  return (
    <QRCodeStyle>
      <canvas ref={ref} />
    </QRCodeStyle>
  );
};

QRCode.propTypes = {
  data: PropTypes.string.isRequired,
  scale: PropTypes.number,
};

const QRCodeStyle = styled.div`
  display: flex;

  margin: 0 auto;
  padding: 2rem;

  background-color: ${styles.colors.white};

  align-items: center;
  justify-content: center;
`;

export default QRCode;
