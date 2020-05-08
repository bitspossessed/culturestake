import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(({ children, to, onClick, ...props }, ref) => {
  const buttonElem = React.createElement(
    'button',
    Object.assign({}, props, {
      onClick,
      ref,
    }),
    children,
  );

  if (to) {
    return React.createElement(Link, { to }, buttonElem);
  }

  return buttonElem;
});

Button.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
  type: PropTypes.string,
};

export default Button;
