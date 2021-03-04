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
    values: { title, festivalId },
  } = useNewForm({
    fields: ['title', 'festivalId', 'artworkId'],
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
  // want to invalidate the select artwork since a different festival has
  // different artworks to choose from. To achieve this I cache the selected
  // festivalId and forcefully invalidate the artworkId if it changes.
  useEffect(() => {
    if (festivalId != festivalIdCache) {
      setFestivalIdCache(festivalId);
      setValues({ title, festivalId, artworkId: null });
    }
  }, [setValues, title, festivalId, festivalIdCache]);

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
