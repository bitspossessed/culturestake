import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import Footer from '~/client/components/Footer';
import FormLogin from '~/client/components/FormLogin';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { requestToken, TOKEN_REQUEST_ID } from '~/client/store/app/actions';
import { useForm } from '~/client/hooks/forms';

const AdminLogin = () => {
  const dispatch = useDispatch();

  const {
    Form,
    meta: {
      canSubmit,
      request: { isPending },
    },
  } = useForm({
    requestId: TOKEN_REQUEST_ID,
    onSubmit: ({ email, password }) => {
      dispatch(requestToken(email, password));
    },
  });

  return (
    <Fragment>
      <Header>
        <h1>{translate('AdminLogin.title')}</h1>
      </Header>

      <View>
        <Form>
          <FormLogin />

          <ButtonSubmit disabled={!canSubmit} isPending={isPending}>
            {translate('AdminLogin.buttonSubmit')}
          </ButtonSubmit>
        </Form>
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminLogin;
