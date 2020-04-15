import React from 'react';

import ThreeModelAnimated from '~/client/components/ThreeModelAnimated';
import logo from '~/client/assets/models/logo.glb';

const ThreeButtonLogo = (props) => {
  return <ThreeModelAnimated {...props} rotation={[2, 0, -0.5]} url={logo} />;
};

export default ThreeButtonLogo;
