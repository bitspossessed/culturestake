import PropTypes from 'prop-types';
import React from 'react';

import ColorSection from '~/client/components/ColorSection';
import Header from '~/client/components/Header';
import HorizontalLine from '~/client/components/HorizontalLine';
import { ContainerStyle } from '~/client/styles/layout';
import { HeadingPrimaryStyle } from '~/client/styles/typography';

const HeaderAdmin = (props) => {
  return (
    <Header>
      <ColorSection>
        <ContainerStyle>
          <HeadingPrimaryStyle>{props.children}</HeadingPrimaryStyle>
          <HorizontalLine />
        </ContainerStyle>
      </ColorSection>
    </Header>
  );
};

HeaderAdmin.propTypes = {
  children: PropTypes.node,
};

export default HeaderAdmin;
