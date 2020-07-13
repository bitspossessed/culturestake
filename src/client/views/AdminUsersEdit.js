import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import DangerZone from '~/client/components/DangerZone';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormUsers from '~/client/components/FormUsers';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import { useEditForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminUsersEdit = () => {
  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminUsersEdit.title')}</HeaderAdmin>
      <AdminUsersEditForm />
    </Fragment>
  );
};

const AdminUsersEditForm = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const returnUrl = '/admin/users';

  const { Form, ButtonDelete } = useEditForm({
    fields: ['email', 'username'],
    resourcePath: ['users', slug],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminUsersEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: (user) => {
      dispatch(
        notify({
          text: translate('AdminUsersEdit.notificationDestroySuccess', {
            username: user.username,
          }),
        }),
      );
    },
    onUpdateSuccess: (user) => {
      dispatch(
        notify({
          text: translate('AdminUsersEdit.notificationSuccess', {
            username: user.username,
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
      <ViewAdmin>
        <Form>
          <FormUsers isPasswordHidden />

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

export default AdminUsersEdit;
