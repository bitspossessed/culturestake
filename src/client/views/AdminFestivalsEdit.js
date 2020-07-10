import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import DangerZone from '~/client/components/DangerZone';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormFestivals from '~/client/components/FormFestivals';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import ContractsFestivals from '~/client/components/ContractsFestivals';
import { useEditForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminFestivalsEdit = () => {
  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminFestivalsEdit.title')}</HeaderAdmin>
      <AdminFestivalsEditForm />
    </Fragment>
  );
};

const AdminFestivalsEditForm = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const returnUrl = '/admin/festivals';

  const {
    ButtonDelete,
    ButtonSubmit,
    Form,
    isResourceLoading,
    resource,
  } = useEditForm({
    fields: ['title', 'description', 'documents', 'images', 'artworks'],
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
      <ViewAdmin>
        <Form>
          <FormFestivals />

          <DangerZone>
            <ButtonDelete />
          </DangerZone>

          {!isResourceLoading && resource.chainId && (
            <ContractsFestivals chainId={resource.chainId} />
          )}

          <ButtonSubmit />
        </Form>
      </ViewAdmin>

      <FooterAdmin>
        <ButtonIcon to={returnUrl}>
          {translate('default.buttonReturnToOverview')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminFestivalsEdit;
