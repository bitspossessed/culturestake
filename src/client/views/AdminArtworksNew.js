import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormArtworks from '~/client/components/FormArtworks';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useNewForm } from '~/client/hooks/forms';

const AdminArtworksNew = () => {
  const dispatch = useDispatch();
  const returnUrl = '/admin/artworks';

  const { Form } = useNewForm({
    fields: [
      'title',
      'description',
      'images',
      'sticker',
      'artistId',
      'url',
      'subtitle',
    ],
    resourcePath: ['artworks'],
    returnUrl,
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminArtworksNew.notificationSuccess', {
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
      <HeaderAdmin>{translate('AdminArtworksNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormArtworks />
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

export default AdminArtworksNew;
