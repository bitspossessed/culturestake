import React, { Fragment } from 'react';
import translate from '~/common/services/i18n';
import { useDispatch } from 'react-redux';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import Finder from '~/client/components/Finder';
import FormQuestions from '~/client/components/FormQuestions';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import { useNewForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const AdminQuestionsNew = () => {
  const dispatch = useDispatch();

  const returnUrl = '/admin/questions';

  const { Form } = useNewForm({
    fields: ['title', 'festivalId'],
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
          <Finder
            label={translate('AdminQuestionsNew.fieldFestival')}
            name="festivalId"
            placeholder={translate('AdminQuestionsNew.fieldPlaceholder')}
            queryPath={'festivals'}
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

export default AdminQuestionsNew;
