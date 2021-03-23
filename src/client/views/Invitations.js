import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import ButtonSubmit from '~/client/components/ButtonSubmit';
import FormInvitations from '~/client/components/FormInvitations';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import ViewAdmin from '~/client/components/ViewAdmin';
import translate from '~/common/services/i18n';

import { useRequestForm } from '~/client/hooks/forms';

const Invitations = () => {
  const dispatch = useDispatch();

  const { Form } = useRequestForm({
    onSubmit: () => {
      dispatch();
    },
  });

  return (
    <Fragment>
      <HeaderAdmin>{translate('Invitations.title')}</HeaderAdmin>

      <ViewAdmin>
        <Form>
          <FormInvitations />
          <ButtonSubmit>{translate('Invitations.buttonSubmit')}</ButtonSubmit>
        </Form>
      </ViewAdmin>
    </Fragment>
  );
};

export default Invitations;
