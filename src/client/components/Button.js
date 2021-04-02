import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(
  (
    {
      children,
      to,
      isDanger = false, // eslint-disable-line no-unused-vars
      isDisabled: disabled,
      href,
      onClick,
      ...props
    },
    ref,
  ) => {
    const buttonElem = React.createElement(
      'button',
      Object.assign({}, props, {
        onClick,
        disabled,
        ref,
      }),
      children,
    );

    if (!href && to) {
      return React.createElement(Link, { to }, buttonElem);
    } else if (href) {
      return React.createElement('a', { href, target: '_blank' }, buttonElem);
    }

    return buttonElem;
  },
);

Button.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  href: PropTypes.string,
  isDanger: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
  type: PropTypes.string,
};

export default Button;
