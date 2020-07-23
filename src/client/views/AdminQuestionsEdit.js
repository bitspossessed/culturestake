import React, { Fragment } from 'react';
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

const AdminQuestionsEdit = () => {
  const returnUrl = '/admin/questions';
  const { id } = useParams();
  const dispatch = useDispatch();

  const { ButtonDelete, Form, isResourceLoading, resource } = useEditForm({
    fields: ['chainId', 'festivalId', 'title'],
    resourcePath: ['questions', id],
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

          <ButtonIcon to={`/admin/questions/${id}/answers/new`}>
            {translate('AdminQuestionsEdit.buttonNewAnswer')}
          </ButtonIcon>

          <DangerZone>
            <ButtonDelete />
          </DangerZone>

          {!isResourceLoading && resource.chainId && (
            <ContractsQuestions
              festivalChainId={resource.festival.chainId}
              questionChainId={resource.chainId}
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
