import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormQuestions from '~/client/components/FormQuestions';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import apiRequest from '~/client/services/api';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useNewForm } from '~/client/hooks/forms';

const AdminFestivalQuestionsNew = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [festival, setFestival] = useState();

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

  const {
    Form,
    setValues,
    values: { title, festivalId, artworkId },
  } = useNewForm({
    fields: ['title', 'festivalId', 'artworkId', 'type'],
    resourcePath: ['questions'],
    returnUrl,
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminFestivalQuestionsNew.notificationSuccess', {
            title,
            festival: festival?.title,
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

  // Switch over the type of the question to an artwork question once we set an artwork.
  useEffect(() => {
    setValues({
      title,
      festivalId,
      artworkId,
      type: artworkId == null ? 'festival' : 'artwork',
    });
  }, [setValues, title, festivalId, artworkId]);

  return (
    <Fragment>
      {!isLoading && festival && (
        <>
          <HeaderAdmin>
            {translate('AdminFestivalQuestionsNew.title', {
              festival: festival?.title,
            })}
          </HeaderAdmin>

          <ViewAdmin>
            <Form>
              <FormQuestions
                festivalId={festival.id}
                showFestivalFinder={false}
              />
              <ButtonSubmit />
            </Form>
          </ViewAdmin>
        </>
      )}

      <FooterAdmin>
        <ButtonIcon isIconFlipped to={returnUrl}>
          {translate('default.buttonReturnToOverview')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminFestivalQuestionsNew;
