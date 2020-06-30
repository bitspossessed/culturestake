import PropTypes from 'prop-types';
import React from 'react';

import ColorSection from '~/client/components/ColorSection';
import Footer from '~/client/components/Footer';
import HorizontalLine from '~/client/components/HorizontalLine';
import { ContainerStyle } from '~/client/styles/layout';

const FooterAdmin = (props) => {
  return (
    <Footer>
      <ColorSection>
        <ContainerStyle>
          <HorizontalLine />
          {props.children}
        </ContainerStyle>
      </ColorSection>
    </Footer>
  );
};

FooterAdmin.propTypes = {
  children: PropTypes.node,
};

export default FooterAdmin;
