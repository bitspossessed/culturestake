import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormOrganisations from '~/client/components/FormOrganisations';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useNewForm } from '~/client/hooks/forms';

const AdminOrganisationsNew = () => {
  const dispatch = useDispatch();
  const returnUrl = '/admin/organisations';

  const { Form } = useNewForm({
    fields: ['name', 'description', 'images'],
    resourcePath: ['organisations'],
    returnUrl,
    onSuccess: ({ name }) => {
      dispatch(
        notify({
          text: translate('AdminOrganisationsNew.notificationSuccess', {
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
      <HeaderAdmin>{translate('AdminOrganisationsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormOrganisations />
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

export default AdminOrganisationsNew;
