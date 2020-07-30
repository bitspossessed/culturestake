import React, { Fragment } from 'react';
import translate from '~/common/services/i18n';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import DangerZone from '~/client/components/DangerZone';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FormArtists from '~/client/components/FormArtists';
import ViewAdmin from '~/client/components/ViewAdmin';
import { useEditForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminArtistsEdit = () => {
  const returnUrl = '/admin/artists';
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { ButtonDelete, Form } = useEditForm({
    fields: ['name', 'bio', 'images', 'consentToDataReveal'],
    resourcePath: ['artists', slug],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminArtistsEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: ({ name }) => {
      dispatch(
        notify({
          text: translate('AdminArtistsEdit.notificationDestroySuccess', {
            name,
          }),
        }),
      );
    },
    onUpdateSuccess: ({ name }) => {
      dispatch(
        notify({
          text: translate('AdminArtistsEdit.notificationSuccess', {
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
      <HeaderAdmin>{translate('AdminArtistsEdit.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormArtists />

          <DangerZone>
            <ButtonDelete />
          </DangerZone>

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

export default AdminArtistsEdit;
