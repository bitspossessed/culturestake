import React, { Fragment } from 'react';
import translate from '~/common/services/i18n';
import { useDispatch } from 'react-redux';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import FormArtworks from '~/client/components/FormArtworks';
import Finder from '~/client/components/Finder';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import { useNewForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminArtworksNew = () => {
  const dispatch = useDispatch();

  const returnUrl = '/admin/artworks';

  const { Form } = useNewForm({
    fields: ['title', 'description', 'images', 'artistId'],
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

          <Finder
            label={translate('AdminArtworksNew.fieldArtist')}
            name="artistId"
            placeholder={translate('AdminArtworksNew.fieldArtistPlaceholder')}
            queryPath={'artists'}
            searchParam={'name'}
          />

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

export default AdminArtworksNew;
