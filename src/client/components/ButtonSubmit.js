import PropTypes from 'prop-types';
import React from 'react';

import ButtonIcon from '~/client/components/ButtonIcon';

const ButtonSubmit = ({ children, isPending, ...rest }) => {
  return (
    <ButtonIcon type="submit" {...rest}>
      {isPending ? '...' : children}
    </ButtonIcon>
  );
};

ButtonSubmit.propTypes = {
  children: PropTypes.node.isRequired,
  isPending: PropTypes.bool.isRequired,
};

export default ButtonSubmit;
