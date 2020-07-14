import PropTypes from 'prop-types';
import React from 'react';

import BoxRounded from '~/client/components/BoxRounded';
import translate from '~/common/services/i18n';

const DangerZone = (props) => {
  return (
    <BoxRounded isDanger title={translate('DangerZone.title')}>
      {props.children}
    </BoxRounded>
  );
};

DangerZone.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DangerZone;
