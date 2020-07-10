import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormFestivals from '~/client/components/FormFestivals';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import { useNewForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminFestivalsNew = () => {
  const dispatch = useDispatch();

  const returnUrl = '/admin/festivals';

  const { Form } = useNewForm({
    fields: ['description', 'documents', 'images', 'title'],
    resourcePath: ['festivals'],
    returnUrl,
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminFestivalsNew.notificationSuccess', {
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
      <HeaderAdmin>{translate('AdminFestivalsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormFestivals />
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

export default AdminFestivalsNew;
