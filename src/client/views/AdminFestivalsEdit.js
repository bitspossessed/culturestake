import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import translate from '~/common/services/i18n';

import Button from '~/client/components/Button';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import Footer from '~/client/components/Footer';
import FormFestivals from '~/client/components/FormFestivals';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { postRequest, destroyRequest } from '~/client/store/api/actions';
import { useForm } from '~/client/hooks/forms';
import { useRequest, useRequestId } from '~/client/hooks/requests';
import { useResource } from '~/client/hooks/resources';
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

        <Link to="/admin/festivals">
          {translate('default.buttonReturnToOverview')}
        </Link>
      </View>

      <Footer />
    </Fragment>
  );
};

const AdminFestivalsEditForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { slug } = useParams();

  const requestId = useRequestId();
  const requestIdDelete = useRequestId();

  const [festival, isLoading] = useResource(['festivals', slug], {
    onError: () => {
      dispatch(
        notify({
          text: translate('AdminFestivalsEdit.errorNotFound'),
        }),
      );

      history.push('/admin/festivals');
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
    defaultValues: festival,
    onSubmit: ({ title, description, images, documents }) => {
      dispatch(
        postRequest({
          id: requestId,
          path: ['festivals', slug],
          body: {
            description,
            documents,
            images,
            title,
          },
        }),
      );
    },
    onSuccess: () => {
      dispatch(
        notify({
          text: translate('AdminFestivalsEdit.notificationSuccess', {
            title: festival.title,
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

  useRequest(requestIdDelete, {
    onSuccess: () => {
      dispatch(
        notify({
          text: translate('AdminFestivalsEdit.notificationDestroySuccess', {
            title: festival.title,
          }),
        }),
      );

      history.push('/admin/festivals');
    },
  });

  const onClickDestroy = () => {
    if (!window.confirm(translate('default.areYouSure'))) {
      return;
    }

    dispatch(
      destroyRequest({
        id: requestIdDelete,
        path: ['festivals', slug],
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
        <FormFestivals />

        <ButtonSubmit disabled={!canSubmit} isPending={isPending}>
          {translate('AdminFestivalsEdit.buttonSubmit')}
        </ButtonSubmit>
      </Form>

      <Button disabled={!canSubmit} onClick={onClickDestroy}>
        {translate('default.buttonDestroy')}
      </Button>
    </Fragment>
  );
};

export default AdminFestivalsEdit;
