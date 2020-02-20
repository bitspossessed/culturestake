import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(({ children, ...rest }, ref) => {
  return (
    <button {...rest} ref={ref}>
      {children}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;
