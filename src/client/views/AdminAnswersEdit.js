import React, { Fragment, useState, useEffect } from 'react';
import translate from '~/common/services/i18n';
import { useParams } from 'react-router-dom';

import apiRequest from '~/client/services/api';
import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import ContractsAnswers from '~/client/components/ContractsAnswers';
import { useEditForm } from '~/client/hooks/forms';

const AdminQuestionsEdit = () => {
  const { questionId, answerId } = useParams();
  const returnUrl = `/admin/questions/${questionId}/edit`;
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState({});

  const { Form, isResourceLoading, resource } = useEditForm({
    fields: [],
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
      <HeaderAdmin>{translate('AdminQuestionsEdit.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          {!isLoading && !isResourceLoading && resource.chainId && (
            <ContractsAnswers
              answerChainId={resource.chainId}
              questionChainId={question.chainId}
            />
          )}
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
