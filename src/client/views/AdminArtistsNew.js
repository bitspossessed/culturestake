import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormArtists from '~/client/components/FormArtists';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useNewForm } from '~/client/hooks/forms';

const AdminArtistsNew = () => {
  const dispatch = useDispatch();
  const returnUrl = '/admin/artists';

  const { Form } = useNewForm({
    fields: ['name', 'bio', 'images', 'consentToDataReveal', 'url'],
    resourcePath: ['artists'],
    returnUrl,
    onSuccess: ({ name }) => {
      dispatch(
        notify({
          text: translate('AdminArtistsNew.notificationSuccess', {
            name,
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
      <HeaderAdmin>{translate('AdminArtistsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormArtists />
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

export default AdminArtistsNew;
