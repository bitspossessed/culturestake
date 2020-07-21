import React, { Fragment } from 'react';
import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import FormQuestions from '~/client/components/FormQuestions';
import ViewAdmin from '~/client/components/ViewAdmin';
import ContractsQuestions from '~/client/components/ContractsQuestions';
import { useEditForm } from '~/client/hooks/forms';

const AdminQuestionsEdit = () => {
  const returnUrl = '/admin/questions';

  const { Form } = useEditForm({});

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminQuestionsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <ContractsQuestions questionAddress={''} />
          <FormQuestions />
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

export default AdminQuestionsEdit;
