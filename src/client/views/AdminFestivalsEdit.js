import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import translate from '~/common/services/i18n';

import Footer from '~/client/components/Footer';
import FormFestivals from '~/client/components/FormFestivals';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { useEditForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminFestivalsEdit = () => {
  return (
    <Fragment>
      <Header>
        <h1>{translate('AdminFestivalsEdit.title')}</h1>
      </Header>

      <View>
        <AdminFestivalsEditForm />
      </View>

      <Footer />
    </Fragment>
  );
};

const AdminFestivalsEditForm = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const returnUrl = '/admin/festivals';

  const { Form, ButtonSubmit, ButtonDelete } = useEditForm({
    fields: ['title', 'description', 'documents', 'images'],
    resourcePath: ['festivals', slug],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminFestivalsEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminFestivalsEdit.notificationDestroySuccess', {
            title,
          }),
        }),
      );
    },
    onUpdateSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminFestivalsEdit.notificationSuccess', {
            title,
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
        <FormFestivals />
        <ButtonSubmit />
      </Form>

      <ButtonDelete />
      <Link to={returnUrl}>{translate('default.buttonReturnToOverview')}</Link>
    </Fragment>
  );
};

export default AdminFestivalsEdit;
