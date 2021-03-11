import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ButtonSubmit from '~/client/components/ButtonSubmit';
import DangerZone from '~/client/components/DangerZone';
import FooterAdmin from '~/client/components/FooterAdmin';
import FormVoteweights from '~/client/components/FormVoteweights';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import apiRequest from '~/client/services/api';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import { useEditForm } from '~/client/hooks/forms';

const AdminVoteweightsEdit = () => {
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

  const { ButtonDelete, Form } = useEditForm({
    fields: [
      'festivalId',
      'name',
      'multiplier',
      'type',
      'latitude',
      'longitude',
      'radius',
      'hotspot',
      'organisationId',
    ],
    resourcePath: ['voteweights', slug],
    returnUrl,
    onNotFound: () => {
      dispatch(
        notify({
          text: translate('AdminVoteweightsEdit.errorNotFound'),
        }),
      );
    },
    onDeleteSuccess: ({ name }) => {
      dispatch(
        notify({
          text: translate('AdminVoteweightsEdit.notificationDestroySuccess', {
            name,
          }),
        }),
      );
    },
    onUpdateSuccess: ({ name }) => {
      dispatch(
        notify({
          text: translate('AdminVoteweightsEdit.notificationSuccess', {
            name,
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

  const onChange = (event) => {
    event.preventDefault();
    setType(event.target.value);
  };

  return (
    <Fragment>
      <HeaderAdmin>{translate('AdminVoteweightsEdit.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          {!isLoading && festival ? (
            <Fragment>
              <FormVoteweights
                festival={festival}
                type={type}
                onChange={onChange}
              />
              <DangerZone>
                <ButtonDelete />
              </DangerZone>
              <ButtonSubmit />
            </Fragment>
          ) : null}
        </Form>
      </ViewAdmin>

      <FooterAdmin>
        <ButtonIcon isIconFlipped to={returnUrl}>
          {translate('AdminVoteweightsEdit.buttonBackToFestival')}
        </ButtonIcon>
      </FooterAdmin>
    </Fragment>
  );
};

export default AdminVoteweightsEdit;
