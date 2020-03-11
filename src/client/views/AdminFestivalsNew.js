import React, { Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import Footer from '~/client/components/Footer';
import FormFestivals from '~/client/components/FormFestivals';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { putRequest } from '~/client/store/api/actions';
import { useForm } from '~/client/hooks/forms';
import { useRequestId } from '~/client/hooks/resources';

import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminFestivalsNew = () => {
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
    onSubmit: ({ title, description }) => {
      dispatch(
        putRequest({
          id: requestId,
          path: ['festivals'],
          body: {
            title,
            description,
          },
        }),
      );
    },
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminFestivalsNew.notificationSuccess', {
            title,
          }),
        }),
      );

      history.push('/admin/festivals');
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
        <h1>{translate('AdminFestivalsNew.title')}</h1>
      </Header>

      <View>
        <Form>
          <FormFestivals />

          <ButtonSubmit disabled={!canSubmit} isPending={isPending}>
            {translate('AdminFestivalsNew.buttonSubmit')}
          </ButtonSubmit>
        </Form>

        <Link to="/admin/festivals">
          {translate('default.buttonReturnToOverview')}
        </Link>
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminFestivalsNew;
