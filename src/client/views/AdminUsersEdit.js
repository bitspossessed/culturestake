import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import translate from '~/common/services/i18n';

import Button from '~/client/components/Button';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import Footer from '~/client/components/Footer';
import FormUsers from '~/client/components/FormUsers';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { postRequest, destroyRequest } from '~/client/store/api/actions';
import { useForm } from '~/client/hooks/forms';
import { useRequestId, useRequest } from '~/client/hooks/requests';
import { useResource } from '~/client/hooks/resources';

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

        <Link to="/admin/users">
          {translate('default.buttonReturnToOverview')}
        </Link>
      </View>

      <Footer />
    </Fragment>
  );
};

const AdminUsersEditForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { slug } = useParams();

  const requestId = useRequestId();
  const requestIdDelete = useRequestId();

  const [user, isLoading] = useResource(['users', slug], {
    onError: () => {
      dispatch(
        notify({
          text: translate('AdminUsersEdit.errorNotFound'),
        }),
      );

      history.push('/admin/users');
    },
  });

  const {
    Form,
    meta: {
      canSubmit,
      request: { isPending },
    },
  } = useForm({
    requestId,
    defaultValues: user,
    onSubmit: ({ email, username }) => {
      dispatch(
        postRequest({
          id: requestId,
          path: ['users', slug],
          body: {
            email,
            username,
          },
        }),
      );
    },
    onSuccess: () => {
      dispatch(
        notify({
          text: translate('AdminUsersEdit.notificationSuccess', {
            username: user.username,
          }),
        }),
      );

      history.push('/admin/users');
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

  useRequest(requestIdDelete, {
    onSuccess: () => {
      dispatch(
        notify({
          text: translate('AdminUsersEdit.notificationDestroySuccess', {
            username: user.username,
          }),
        }),
      );

      history.push('/admin/users');
    },
  });

  const onClickDestroy = () => {
    if (!window.confirm(translate('default.areYouSure'))) {
      return;
    }

    dispatch(
      destroyRequest({
        id: requestIdDelete,
        path: ['users', slug],
      }),
    );
  };

  if (isLoading) {
    // @TODO: Show spinner etc.
    return null;
  }

  return (
    <Fragment>
      <Form>
        <FormUsers isPasswordHidden />

        <ButtonSubmit disabled={!canSubmit} isPending={isPending}>
          {translate('AdminUsersEdit.buttonSubmit')}
        </ButtonSubmit>
      </Form>

      <Button disabled={!canSubmit} onClick={onClickDestroy}>
        {translate('default.buttonDestroy')}
      </Button>
    </Fragment>
  );
};

export default AdminUsersEdit;
