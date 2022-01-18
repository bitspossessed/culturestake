import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ContractsAnswers from '~/client/components/ContractsAnswers';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormAnswers from '~/client/components/FormAnswers';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import translate from '~/common/services/i18n';
import { useEditForm } from '~/client/hooks/forms';
import DangerZone from '~/client/components/DangerZone';

const AdminAnswersEdit = () => {
  const { slug, questionId, answerId } = useParams();
  const [isDeactivated, setIsDeactivated] = useState(false);

  const returnUrl = `/admin/events/${slug}/questions/${questionId}/edit`;

  const { Form, isResourceLoading, resource, ButtonDelete } = useEditForm({
    fields: ['questionId', 'artworkId', 'propertyId'],
    resourcePath: ['answers', answerId],
    returnUrl,
  });

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminAnswersEdit.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          {!isResourceLoading && resource.chainId && (
            <Fragment>
              <FormAnswers
                festivalId={resource.festivalId}
                isDisabled
                question={resource.question}
              />

              {isDeactivated ? (
                <DangerZone>
                  <ButtonDelete />
                </DangerZone>
              ) : null}

              <ContractsAnswers
                answerChainId={resource.chainId}
                handleDeactivate={(state) => setIsDeactivated(state)}
                questionChainId={resource.question.chainId}
              />
            </Fragment>
          )}
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

export default AdminAnswersEdit;
