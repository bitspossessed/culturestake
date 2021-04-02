import PropTypes from 'prop-types';
import React from 'react';
import translate from '~/common/services/i18n';
import { useFormContext } from 'react-form';

import ButtonIcon from '~/client/components/ButtonIcon';
import swirl from '~/client/assets/images/swirl.svg';

const ButtonSubmit = ({ children, isDisabled, ...rest }) => {
  const { meta } = useFormContext();

  return (
    <ButtonIcon
      isDisabled={isDisabled || !meta.canSubmit}
      type="submit"
      url={swirl}
      {...rest}
    >
      {meta.isSubmitting
        ? '...'
        : children || translate('default.buttonSubmitEdit')}
    </ButtonIcon>
  );
};

ButtonSubmit.propTypes = {
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
};

export default ButtonSubmit;
