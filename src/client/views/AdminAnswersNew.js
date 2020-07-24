import React, { Fragment, useState, useEffect } from 'react';
import translate from '~/common/services/i18n';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import apiRequest from '~/client/services/api';
import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import Finder from '~/client/components/Finder';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import { useNewForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import InputHiddenField from '~/client/components/InputHiddenField';

const AdminAnswersNew = () => {
  const dispatch = useDispatch();
  const { questionId } = useParams();

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
    fields: ['type', 'questionId', 'artworkId'],
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
          {!isLoading ? (
            <Fragment>
              <InputHiddenField
                label={'questionId'}
                name={'questionId'}
                value={{ value: questionId }}
              />
              {question && !question.artworkId ? (
                <Finder
                  label={translate('AdminAnswersNew.fieldArtwork')}
                  name="artworkId"
                  placeholder={translate(
                    'AdminAnswersNew.fieldArtworkPlaceholder',
                  )}
                  queryPath={'artworks'}
                  searchParam={'title'}
                />
              ) : null}
              <ButtonSubmit />
            </Fragment>
          ) : null}
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

export default AdminAnswersNew;
