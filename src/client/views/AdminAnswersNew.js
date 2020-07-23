import React, { Fragment, useState } from 'react';
import translate from '~/common/services/i18n';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Joi from '@hapi/joi';

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
import {
  InputSelectFieldInnerStyle,
  InputSelectFieldStyle,
} from '~/client/components/InputSelectField';

const AdminAnswersNew = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [type, setType] = useState('artwork');

  const schema = {
    type: Joi.string().valid('artwork'),
  };

  const possibleTypes = ['artwork', 'property'];

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

  const onChange = (event) => {
    event.preventDefault();
    console.log(event.target.value)
    setType(event.target.name, event.target.value);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminQuestionsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <InputSelectFieldStyle name="type" validate={schema.type}>
            <InputSelectFieldInnerStyle
              name="type"
              value={type}
              onChange={onChange}
            >
              {possibleTypes.map((value) => {
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </InputSelectFieldInnerStyle>
          </InputSelectFieldStyle>

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
