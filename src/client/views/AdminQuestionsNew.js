import React, { Fragment } from 'react';
import translate from '~/common/services/i18n';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import ContractsQuestions from '~/client/components/ContractsQuestions';
import { useNewForm } from '~/client/hooks/forms';

const AdminQuestionsNew = () => {
  const returnUrl = '/admin/questions';

  const { Form } = useNewForm({});

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminQuestionsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <ContractsQuestions questionAddress={''} />
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
