import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import AnswersTable from '~/client/components/FestivalAnswersTable';
import BoxRounded from '~/client/components/BoxRounded';
import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import ContractsQuestions from '~/client/components/ContractsQuestions';
import ExportVotesContainer from '~/client/components/ExportVotesContainer';
import DangerZone from '~/client/components/DangerZone';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormQuestions from '~/client/components/FormQuestions';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import apiRequest from '~/client/services/api';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useEditForm } from '~/client/hooks/forms';
import swirl from '~/client/assets/images/swirl.svg';

const AdminFestivalQuestionsEdit = () => {
  const dispatch = useDispatch();
  const { slug, questionId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [festival, setFestival] = useState();
  const [isInitialized, setIsInitialized] = useState(false);

  const returnUrl = `/admin/festivals/${slug}/edit`;

  useEffect(() => {
    const getFestival = async () => {
      const response = await apiRequest({
        path: ['festivals', slug],
      });

      setFestival(response);
      setIsLoading(false);
    };

    getFestival();
  }, [setFestival, setIsLoading, slug]);

  const { ButtonDelete, Form, isResourceLoading, resource } = useEditForm({
    fields: ['title', 'festivalId', 'artworkId', 'type'],
    resourcePath: ['questions', questionId],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminFestivalQuestionsEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate(
            'AdminFestivalQuestionsEdit.notificationDestroySuccess',
            {
              title,
              festival: festival?.title,
            },
          ),
        }),
      );
    },
    onUpdateSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminFestivalQuestionsEdit.notificationSuccess', {
            title,
            festival: festival?.title,
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
      <HeaderAdmin>
        {!isLoading &&
          festival &&
          translate('AdminFestivalQuestionsEdit.title', {
            festival: festival?.title,
          })}
      </HeaderAdmin>

      <ViewAdmin>
        {!isLoading && festival && (
          <Form>
            <FormQuestions
              festivalId={resource.festivalId}
              isArtworkDisabled={isInitialized}
              showArtworkFinder={resource.type === 'artwork'}
              showFestivalFinder={false}
            />

            <BoxRounded
              title={translate(`AdminFestivalQuestionsEdit.bodyAnswers`)}
            >
              <AnswersTable
                isArtworkQuestion={resource.artworkId ? true : false}
                isInitialized={isInitialized}
              />

              <ButtonIcon
                to={`/admin/festivals/${slug}/questions/${questionId}/answers/new`}
                url={swirl}
              >
                {translate('AdminFestivalQuestionsEdit.buttonNewAnswer')}
              </ButtonIcon>
            </BoxRounded>

            {!isResourceLoading && (
              <ExportVotesContainer
                name={resource.slug}
                path={['questions', questionId, 'votes']}
              />
            )}

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
        )}
      </ViewAdmin>

      <FooterAdmin>
        <ButtonIcon isIconFlipped to={returnUrl}>
          {translate('default.buttonReturnToOverview')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminFestivalQuestionsEdit;
