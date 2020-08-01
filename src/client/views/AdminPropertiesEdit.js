import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import DangerZone from '~/client/components/DangerZone';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormProperties from '~/client/components/FormProperties';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useEditForm } from '~/client/hooks/forms';

const AdminPropertiesEdit = () => {
  const returnUrl = '/admin/properties';
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { ButtonDelete, Form } = useEditForm({
    fields: ['title'],
    resourcePath: ['properties', slug],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminPropertiesEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminPropertiesEdit.notificationDestroySuccess', {
            title,
          }),
        }),
      );
    },
    onUpdateSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminPropertiesEdit.notificationSuccess', {
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
      <HeaderAdmin>{translate('AdminPropertiesEdit.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormProperties />

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

export default AdminPropertiesEdit;
