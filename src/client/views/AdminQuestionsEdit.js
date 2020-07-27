import React, { Fragment, useState } from 'react';
import translate from '~/common/services/i18n';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import FooterAdmin from '~/client/components/FooterAdmin';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import DangerZone from '~/client/components/DangerZone';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FormQuestions from '~/client/components/FormQuestions';
import ViewAdmin from '~/client/components/ViewAdmin';
import ContractsQuestions from '~/client/components/ContractsQuestions';
import { useEditForm } from '~/client/hooks/forms';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import AnswersTable from '~/client/components/AnswersTable';

const AdminQuestionsEdit = () => {
  const returnUrl = '/admin/questions';
  const { questionId } = useParams();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  const { ButtonDelete, Form, isResourceLoading, resource } = useEditForm({
    fields: ['chainId', 'festivalId', 'title'],
    resourcePath: ['questions', questionId],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminQuestionsEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminQuestionsEdit.notificationDestroySuccess', {
            title,
          }),
        }),
      );
    },
    onUpdateSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminQuestionsEdit.notificationSuccess', {
            title,
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
      <HeaderAdmin>{translate('AdminQuestionsEdit.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormQuestions />

          <AnswersTable
            isArtworkQuestion={resource.artworkId ? true : false}
            isInitialized={isInitialized}
          />

          <ButtonIcon to={`/admin/questions/${questionId}/answers/new`}>
            {translate('AdminQuestionsEdit.buttonNewAnswer')}
          </ButtonIcon>

          <DangerZone>
            <ButtonDelete />
          </DangerZone>

          {!isResourceLoading && resource.chainId && (
            <ContractsQuestions
              festivalChainId={resource.festival.chainId}
              isInitialized={isInitialized}
              questionChainId={resource.chainId}
              setIsInitialized={setIsInitialized}
            />
          )}

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

export default AdminQuestionsEdit;
