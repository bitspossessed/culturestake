import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import translate from '~/common/services/i18n';

import Footer from '~/client/components/Footer';
import FormUsers from '~/client/components/FormUsers';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { useEditForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminUsersEdit = () => {
  return (
    <Fragment>
      <Header>
        <h1>{translate('AdminUsersEdit.title')}</h1>
      </Header>

      <View>
        <AdminUsersEditForm />
      </View>

      <Footer />
    </Fragment>
  );
};

const AdminUsersEditForm = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const returnUrl = '/admin/users';

  const { Form, ButtonSubmit, ButtonDelete } = useEditForm({
    fields: ['email', 'username'],
    resourcePath: ['users', slug],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminUsersEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: (user) => {
      dispatch(
        notify({
          text: translate('AdminUsersEdit.notificationDestroySuccess', {
            username: user.username,
          }),
        }),
      );
    },
    onUpdateSuccess: (user) => {
      dispatch(
        notify({
          text: translate('AdminUsersEdit.notificationSuccess', {
            username: user.username,
          }),
        }),
      );
    },
    onUpdateError: () => {
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
      <Form>
        <FormUsers isPasswordHidden />
        <ButtonSubmit />
      </Form>

      <ButtonDelete />
      <Link to={returnUrl}>{translate('default.buttonReturnToOverview')}</Link>
    </Fragment>
  );
};

export default AdminUsersEdit;
