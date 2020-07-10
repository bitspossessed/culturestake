import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import FormLogin from '~/client/components/FormLogin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import { requestToken, TOKEN_REQUEST_ID } from '~/client/store/app/actions';
import { useRequestForm } from '~/client/hooks/forms';

const AdminLogin = () => {
  const dispatch = useDispatch();

  const { Form } = useRequestForm({
    requestId: TOKEN_REQUEST_ID,
    onSubmit: ({ email, password }) => {
      dispatch(requestToken(email, password));
    },
  });

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminLogin.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormLogin />
          <ButtonSubmit>{translate('AdminLogin.buttonSubmit')}</ButtonSubmit>
        </Form>
      </ViewAdmin>
    </Fragment>
  );
};

export default AdminLogin;
