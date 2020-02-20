import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/client/components/Button';

const ButtonSubmit = ({ children, isPending, ...rest }) => {
  return (
    <Button type="submit" {...rest}>
      {isPending ? '...' : children}
    </Button>
  );
};

ButtonSubmit.propTypes = {
  children: PropTypes.node.isRequired,
  isPending: PropTypes.bool.isRequired,
};

export default ButtonSubmit;
