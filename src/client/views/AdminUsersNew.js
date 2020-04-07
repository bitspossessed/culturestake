import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import Footer from '~/client/components/Footer';
import FormUsers from '~/client/components/FormUsers';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { useNewForm } from '~/client/hooks/forms';

import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminUsersNew = () => {
  const dispatch = useDispatch();

  const returnUrl = '/admin/users';

  const { ButtonSubmit, Form } = useNewForm({
    fields: ['email', 'password', 'username'],
    resourcePath: ['users'],
    returnUrl,
    onSuccess: ({ username }) => {
      dispatch(
        notify({
          text: translate('AdminFestivalsNew.notificationSuccess', {
            username,
          }),
        }),
      );
    },
    onError: () => {
      dispatch(
        notify({
          text: translate('default.errorMessage'),
          type: NotificationsTypes.ERROR,
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
          <ButtonSubmit />
        </Form>

        <Link to={returnUrl}>
          {translate('default.buttonReturnToOverview')}
        </Link>
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminUsersNew;
