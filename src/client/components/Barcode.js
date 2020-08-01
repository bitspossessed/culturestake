import PropTypes from 'prop-types';
import React from 'react';

import BoxRounded from '~/client/components/BoxRounded';
import styled from 'styled-components';
import translate from '~/common/services/i18n';

const Barcode = (props) => {
  return process.env.BARCODE_URL && props.barcode ? (
    <BoxRounded title={translate('Barcode.title')}>
      <BarcodeImageStyle
        src={process.env.BARCODE_URL.replace('{barcode}', props.barcode)}
      />
    </BoxRounded>
  ) : null;
};

Barcode.propTypes = {
  barcode: PropTypes.string,
};

export const BarcodeImageStyle = styled.img`
  display: block;

  max-width: 100%;

  margin: 0 auto;
  padding: 2rem;
`;

export default Barcode;
