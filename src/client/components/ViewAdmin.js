import PropTypes from 'prop-types';
import React from 'react';

import ColorSection from '~/client/components/ColorSection';
import { ContainerStyle } from '~/client/styles/layout';

const ViewAdmin = (props) => {
  return (
    <main>
      <ColorSection>
        <ContainerStyle>{props.children}</ContainerStyle>
      </ColorSection>
    </main>
  );
};

ViewAdmin.propTypes = {
  children: PropTypes.node,
};

export default ViewAdmin;
