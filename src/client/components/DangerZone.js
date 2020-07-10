import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { HeadingSecondaryStyle } from '~/client/styles/typography';

const DangerZone = (props) => {
  return (
    <DangerZoneStyle>
      <HeadingSecondaryStyle>
        {translate('DangerZone.title')}
      </HeadingSecondaryStyle>

      <DangerZoneInnerStyle>{props.children}</DangerZoneInnerStyle>
    </DangerZoneStyle>
  );
};

DangerZone.propTypes = {
  children: PropTypes.node.isRequired,
};

const DangerZoneStyle = styled.section`
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;

  border: 1.5px solid ${styles.colors.red};
  border-radius: 20px;

  color: ${styles.colors.red};

  ${HeadingSecondaryStyle} {
    color: ${styles.colors.red};
  }
`;

const DangerZoneInnerStyle = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;

  border-top: 1.5px solid ${styles.colors.red};
`;

export default DangerZone;
