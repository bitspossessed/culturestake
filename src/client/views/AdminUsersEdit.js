import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import translate from '~/common/services/i18n';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import Footer from '~/client/components/Footer';
import FormUsers from '~/client/components/FormUsers';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { postRequest } from '~/client/store/api/actions';
import { useForm } from '~/client/hooks/forms';
import { useResource } from '~/client/hooks/resources';

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

  const { slug } = useParams();
  const [user, isLoading] = useResource(['users', slug]);

  const {
    Form,
    meta: {
      canSubmit,
      request: { isPending },
    },
  } = useForm({
    defaultValues: user,
    onSubmit: ({ email, username }) => {
      dispatch(
        postRequest({
          path: ['users', slug],
          body: {
            email,
            username,
          },
        }),
      );
    },
  });

  if (isLoading) {
    // @TODO: Show spinner etc.
    return null;
  }

  return (
    <Form>
      <FormUsers isPasswordHidden />

      <ButtonSubmit disabled={!canSubmit} isPending={isPending}>
        {translate('AdminUsersEdit.buttonSubmit')}
      </ButtonSubmit>
    </Form>
  );
};

export default AdminUsersEdit;
