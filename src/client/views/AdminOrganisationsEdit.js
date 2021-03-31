import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import DangerZone from '~/client/components/DangerZone';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormOrganisations from '~/client/components/FormOrganisations';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import translate from '~/common/services/i18n';
import { useEditForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminOrganisationsEdit = () => {
  const returnUrl = '/admin/organisations';
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { ButtonDelete, Form } = useEditForm({
    fields: ['name', 'description', 'images'],
    resourcePath: ['organisations', slug],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminOrganisationsEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: ({ name }) => {
      dispatch(
        notify({
          text: translate('AdminOrganisationsEdit.notificationDestroySuccess', {
            name,
          }),
        }),
      );
    },
    onUpdateSuccess: ({ name }) => {
      dispatch(
        notify({
          text: translate('AdminOrganisationsEdit.notificationSuccess', {
            name,
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
      <HeaderAdmin>{translate('AdminOrganisationsEdit.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormOrganisations />

          <DangerZone>
            <ButtonDelete />
          </DangerZone>

          <ButtonSubmit />
        </Form>
      </ViewAdmin>

      <FooterAdmin>
        <ButtonIcon isIconFlipped to={returnUrl}>
          {translate('default.buttonReturnToOverview')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminOrganisationsEdit;
