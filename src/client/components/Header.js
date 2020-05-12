import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Header = (props) => {
  return <HeaderStyle>{props.children}</HeaderStyle>;
};

const HeaderStyle = styled.header`
  padding-top: 8rem;
`;

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
