import React, { Fragment } from 'react';
import httpStatus from 'http-status';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import Footer from '~/client/components/Footer';
import FormUsers from '~/client/components/FormUsers';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { APIError } from '~/client/utils/errors';
import { putRequest } from '~/client/store/api/actions';
import { useForm } from '~/client/hooks/forms';
import { useRequestId } from '~/client/hooks/requests';

import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminUsersNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const requestId = useRequestId();

  const {
    Form,
    meta: {
      canSubmit,
      request: { isPending },
    },
  } = useForm({
    requestId,
    onSubmit: ({ email, password, username }) => {
      dispatch(
        putRequest({
          id: requestId,
          path: ['users'],
          body: {
            email,
            password,
            username,
          },
        }),
      );
    },
    onSuccess: ({ username }) => {
      dispatch(
        notify({
          text: translate('AdminUsersNew.notificationSuccess', {
            username: username,
          }),
        }),
      );

      history.push('/admin/users');
    },
    onError: error => {
      let text = translate('default.errorMessage');

      if (
        error instanceof APIError &&
        error.response.code === httpStatus.CONFLICT
      ) {
        text = translate('AdminUsersNew.errorUniqueUser');
      }

      dispatch(
        notify({
          text,
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
