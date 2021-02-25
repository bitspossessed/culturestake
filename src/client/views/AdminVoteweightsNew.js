import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormVoteweights from '~/client/components/FormVoteweights';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import apiRequest from '~/client/services/api';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useNewForm } from '~/client/hooks/forms';

const AdminVoteweightsNew = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [festival, setFestival] = useState({});
  const [type, setType] = useState('location');

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

  const { Form, setFieldValue } = useNewForm({
    fields: [
      'festivalId',
      'name',
      'strength',
      'type',
      'latitude',
      'longitude',
      'radius',
      'hotspot',
      'organisationId',
    ],
    resourcePath: ['voteweights'],
    returnUrl,
    onSuccess: ({ title }) => {
      dispatch(
        notify({
          text: translate('AdminVoteweightsNew.notificationSuccess', {
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
    setFieldValue('longitude', undefined);
    setFieldValue('latitude', undefined);
    setFieldValue('radius', undefined);
    setFieldValue('hotspot', undefined);
    setFieldValue('organisationId', undefined);
    setType(event.target.value);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminVoteweightsNew.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          {!isLoading && festival ? (
            <Fragment>
              <FormVoteweights
                festival={festival}
                type={type}
                onChange={onChange}
              />
              <ButtonSubmit />
            </Fragment>
          ) : null}
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

export default AdminVoteweightsNew;
