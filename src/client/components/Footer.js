import PropTypes from 'prop-types';
import React from 'react';

const Footer = props => {
  return <footer>{props.children}</footer>;
};

Footer.propTypes = {
  children: PropTypes.node,
};

export default Footer;
