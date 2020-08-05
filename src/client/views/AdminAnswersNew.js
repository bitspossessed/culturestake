import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormAnswers from '~/client/components/FormAnswers';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import apiRequest from '~/client/services/api';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useNewForm } from '~/client/hooks/forms';

const AdminAnswersNew = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const questionId = parseInt(params.questionId, 10);

  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState({});

  const returnUrl = `/admin/questions/${questionId}/edit`;

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

  const { Form } = useNewForm({
    fields: ['questionId', 'artworkId', 'propertyId'],
    resourcePath: ['answers'],
    returnUrl,
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminAnswersNew.notificationSuccess', {
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
      <HeaderAdmin>{translate('AdminAnswersNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          {!isLoading && question ? (
            <Fragment>
              <FormAnswers
                festivalId={question.festivalId}
                isArtworkAnswer={!!question.artworkId}
                question={question}
              />

              <ButtonSubmit />
            </Fragment>
          ) : null}
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

export default AdminAnswersNew;
