import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormProperties from '~/client/components/FormProperties';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useNewForm } from '~/client/hooks/forms';

const AdminPropertiesNew = () => {
  const dispatch = useDispatch();
  const returnUrl = '/admin/properties';

  const { Form } = useNewForm({
    fields: ['title'],
    resourcePath: ['properties'],
    returnUrl,
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminPropertiesNew.notificationSuccess', {
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
      <HeaderAdmin>{translate('AdminPropertiesNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormProperties />
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

export default AdminPropertiesNew;
