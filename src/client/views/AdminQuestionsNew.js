import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormQuestions from '~/client/components/FormQuestions';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useNewForm } from '~/client/hooks/forms';

const AdminQuestionsNew = () => {
  const dispatch = useDispatch();
  const returnUrl = '/admin/questions';
  const [festivalIdCache, setFestivalIdCache] = useState();

  const {
    Form,
    setValues,
    values: { title, festivalId, artworkId, type },
  } = useNewForm({
    fields: ['title', 'festivalId', 'artworkId', 'type'],
    resourcePath: ['questions'],
    returnUrl,
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminQuestionsNew.notificationSuccess', {
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

  // Artworks are chosen based on the festival. When selecting a new festival we
  // want to invalidate the selected artwork since a different festival has
  // different artworks to choose from. To achieve this I cache the selected
  // festivalId and forcefully invalidate the artworkId if it changes.
  useEffect(() => {
    if (festivalId != festivalIdCache) {
      setFestivalIdCache(festivalId);
      setValues({ title, festivalId, type: 'festival', artworkId: undefined });
    }
  }, [setValues, title, festivalId, type, festivalIdCache]);

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
      <HeaderAdmin>{translate('AdminQuestionsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormQuestions festivalId={festivalId} />
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

export default AdminQuestionsNew;
