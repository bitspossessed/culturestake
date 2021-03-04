import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Barcode from '~/client/components/Barcode';
import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import DangerZone from '~/client/components/DangerZone';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormArtworks from '~/client/components/FormArtworks';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useEditForm } from '~/client/hooks/forms';

const AdminArtworksEdit = () => {
  const returnUrl = '/admin/artworks';
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { ButtonDelete, Form, resource, isResourceLoading } = useEditForm({
    fields: [
      'artistId',
      'description',
      'descriptionCommission',
      'documents',
      'imageCredits',
      'images',
      'sticker',
      'subtitle',
      'title',
      'url',
    ],
    resourcePath: ['artworks', slug],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminArtworksEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminArtworksEdit.notificationDestroySuccess', {
            title,
          }),
        }),
      );
    },
    onUpdateSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminArtworksEdit.notificationSuccess', {
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
      <HeaderAdmin>{translate('AdminArtworksEdit.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormArtworks />

          {resource && !isResourceLoading && (
            <Barcode barcode={resource.barcode} />
          )}

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

export default AdminArtworksEdit;
