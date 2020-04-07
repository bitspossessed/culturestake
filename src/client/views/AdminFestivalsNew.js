import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import Footer from '~/client/components/Footer';
import FormFestivals from '~/client/components/FormFestivals';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { useNewForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminFestivalsNew = () => {
  const dispatch = useDispatch();

  const returnUrl = '/admin/festivals';

  const { ButtonSubmit, Form } = useNewForm({
    fields: ['description', 'documents', 'images', 'title'],
    resourcePath: ['festivals'],
    returnUrl,
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminFestivalsNew.notificationSuccess', {
            title,
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
        <h1>{translate('AdminFestivalsNew.title')}</h1>
      </Header>

      <View>
        <Form>
          <FormFestivals />
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

export default AdminFestivalsNew;
