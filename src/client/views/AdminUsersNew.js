import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormUsers from '~/client/components/FormUsers';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import translate from '~/common/services/i18n';
import { useNewForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminUsersNew = () => {
  const dispatch = useDispatch();

  const returnUrl = '/admin/users';

  const { Form } = useNewForm({
    fields: ['email', 'password', 'username'],
    resourcePath: ['users'],
    returnUrl,
    onSuccess: ({ username }) => {
      dispatch(
        notify({
          text: translate('AdminUsersNew.notificationSuccess', {
            username,
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
      <HeaderAdmin>{translate('AdminUsersNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormUsers />
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

export default AdminUsersNew;
