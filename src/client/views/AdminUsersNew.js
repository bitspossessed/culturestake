import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import Footer from '~/client/components/Footer';
import FormUsers from '~/client/components/FormUsers';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { putRequest } from '~/client/store/api/actions';
import { useForm } from '~/client/hooks/forms';

const AdminUsersNew = () => {
  const dispatch = useDispatch();

  const {
    Form,
    meta: {
      canSubmit,
      request: { isPending },
    },
  } = useForm({
    onSubmit: ({ email, password, username }) => {
      dispatch(
        putRequest({
          path: ['users'],
          body: {
            email,
            password,
            username,
          },
        }),
      );
    },
  });

  return (
    <Fragment>
      <Header>
        <h1>{translate('AdminUsersNew.title')}</h1>
      </Header>

      <View>
        <Form>
          <FormUsers />

          <ButtonSubmit disabled={!canSubmit} isPending={isPending}>
            {translate('AdminUsersNew.buttonSubmit')}
          </ButtonSubmit>
        </Form>

        <Link to="/admin/users">
          {translate('default.buttonReturnToOverview')}
        </Link>
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminUsersNew;
