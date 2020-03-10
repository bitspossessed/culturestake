import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import translate from '~/common/services/i18n';

import Footer from '~/client/components/Footer';
import Header from '~/client/components/Header';
import Table, { ACTION_EDIT } from '~/client/components/Table';
import View from '~/client/components/View';

const table = {
  path: ['festivals'],
  columns: [
    {
      isOrderKey: true,
      key: 'title',
      label: translate('AdminFestivals.fieldTitle'),
    },
  ],
  actions: [
    {
      label: translate('default.tableActionEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const AdminFestivals = () => {
  const history = useHistory();

  const onSelect = ({ item: { slug } }) => {
    history.push(`/admin/festivals/${slug}/edit`);
  };

  return (
    <Fragment>
      <Header>
        <h1>{translate('AdminFestivals.title')}</h1>
      </Header>

      <View>
        <Table
          actions={table.actions}
          columns={table.columns}
          path={table.path}
          onSelect={onSelect}
        />

        <Link to="/admin/festivals/new">
          {translate('AdminFestivals.buttonNewFestival')}
        </Link>
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminFestivals;
