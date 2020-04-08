import React, { Fragment } from 'react';

import Fonts from '~/client/styles/fonts';
import Global from '~/client/styles/global';
import Layout from '~/client/styles/layout';
import Links from '~/client/styles/links';
import Typography from '~/client/styles/typography';

const GlobalStyle = () => {
  return (
    <Fragment>
      <Fonts />
      <Global />
      <Layout />
      <Links />
      <Typography />
    </Fragment>
  );
};

export default GlobalStyle;
