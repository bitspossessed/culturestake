import React from 'react';
import styled from 'styled-components';

import dotline from '~/client/assets/images/dotline.svg';

const HorizontalLine = () => {
  return <HorizontalLineStyle />;
};

const HorizontalLineStyle = styled.hr`
  height: 1rem;

  margin-top: 2rem;
  margin-bottom: 2rem;

  border: 0;

  background-color: transparent;
  background-image: url(${dotline});
  background-repeat: no-repeat;
  background-position: center;
`;

export default HorizontalLine;
