import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ContractsAnswers from '~/client/components/ContractsAnswers';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormAnswers from '~/client/components/FormAnswers';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import apiRequest from '~/client/services/api';
import translate from '~/common/services/i18n';
import { useEditForm } from '~/client/hooks/forms';

const AdminAnswersEdit = () => {
  const { questionId, answerId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState({});

  const returnUrl = `/admin/questions/${questionId}/edit`;

  const { Form, isResourceLoading, resource } = useEditForm({
    fields: ['questionId', 'artworkId', 'propertyId'],
    resourcePath: ['answers', answerId],
    returnUrl,
  });

  useEffect(() => {
    const getQuestion = async () => {
      const response = await apiRequest({
        path: ['questions', questionId],
      });

      setQuestion(response);
      setIsLoading(false);
    };

    getQuestion();
  }, [setQuestion, setIsLoading, questionId]);

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminAnswersEdit.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          {!isLoading && !isResourceLoading && resource.chainId && (
            <Fragment>
              <FormAnswers
                festivalId={resource.festivalId}
                isArtworkAnswer={!!resource.artwork}
                isDisabled
                questionId={resource.questionId}
              />

              <ContractsAnswers
                answerChainId={resource.chainId}
                questionChainId={question.chainId}
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
