import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import AnswersTable from '~/client/components/AnswersTable';
import BoxRounded from '~/client/components/BoxRounded';
import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import ContractsQuestions from '~/client/components/ContractsQuestions';
import DangerZone from '~/client/components/DangerZone';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormQuestions from '~/client/components/FormQuestions';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import swirl from '~/client/assets/images/swirl.svg';
import translate from '~/common/services/i18n';
import { useEditForm } from '~/client/hooks/forms';

const AdminQuestionsEdit = () => {
  const returnUrl = '/admin/questions';
  const { questionId } = useParams();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  const { ButtonDelete, Form, isResourceLoading, resource } = useEditForm({
    fields: ['artworkId', 'festivalId', 'title'],
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
          <FormQuestions isFinderDisabled />

          <BoxRounded title={translate(`AdminQuestionsEdit.bodyAnswers`)}>
            <AnswersTable
              isArtworkQuestion={resource.artworkId ? true : false}
              isInitialized={isInitialized}
            />

            <ButtonIcon
              to={`/admin/questions/${questionId}/answers/new`}
              url={swirl}
            >
              {translate('AdminQuestionsEdit.buttonNewAnswer')}
            </ButtonIcon>
          </BoxRounded>

          <DangerZone>
            <ButtonDelete />
          </DangerZone>

          {!isResourceLoading && resource && resource.chainId && (
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
        <ButtonIcon isIconFlipped to={returnUrl}>
          {translate('default.buttonReturnToOverview')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminQuestionsEdit;
