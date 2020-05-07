import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Fonts from '~/client/styles/fonts';
import Global from '~/client/styles/global';
import Layout from '~/client/styles/layout';
import Links from '~/client/styles/links';
import Typography from '~/client/styles/typography';

const GlobalStyle = (props) => {
  return (
    <Fragment>
      <Fonts />
      <Global />
      <Layout isAlternateColor={props.isAlternateColor} />
      <Links />
      <Typography />
    </Fragment>
  );
};

GlobalStyle.propTypes = {
  isAlternateColor: PropTypes.bool.isRequired,
};

export default GlobalStyle;
