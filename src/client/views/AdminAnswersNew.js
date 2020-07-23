import React, { Fragment } from 'react';
import translate from '~/common/services/i18n';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

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
import InputSelectAnswerTypeField from '~/client/components/InputSelectAnswerTypeField';

const AdminAnswersNew = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  // const [type, setType] = useState('artwork');

  // const possibleTypes = ['artwork', 'property'];

  const returnUrl = `/admin/questions/${id}`;

  const { Form } = useNewForm({
    fields: ['type', 'questionId', 'artworkId'],
    resourcePath: ['answers'],
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

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminQuestionsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <InputSelectAnswerTypeField label={"type"} name={"type"} />

          <Finder
            label={translate('AdminQuestionsNew.fieldFestival')}
            name="artworkId"
            placeholder={translate('AdminQuestionsNew.fieldPlaceholder')}
            queryPath={'artworks'}
            searchParam={'title'}
          />
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

export default AdminAnswersNew;
