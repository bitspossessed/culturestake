import React, { Fragment } from 'react';

import translate from '~/common/services/i18n';

import Header from '~/client/components/Header';

const NotFound = () => {
  return (
    <Fragment>
      <Header>
        <h1>{translate('NotFound.title')}</h1>
      </Header>
    </Fragment>
  );
};

export default NotFound;
