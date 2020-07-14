import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormQuestions from '~/client/components/FormQuestions';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import { useNewForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminQuestionsNew = () => {
  const dispatch = useDispatch();

  const returnUrl = '/admin/questions';

  const { Form } = useNewForm({
    fields: ['festivalId', 'title'],
    resourcePath: ['questions'],
    returnUrl,
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminQuestionsNew.notificationSuccess', {
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
      <HeaderAdmin>{translate('AdminQuestionsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormQuestions />
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

export default AdminQuestionsNew;
