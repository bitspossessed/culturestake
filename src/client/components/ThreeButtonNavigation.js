import React from 'react';

import ThreeModelAnimated from '~/client/components/ThreeModelAnimated';
import close from '~/client/assets/models/close.glb';

const ThreeButtonNavigation = (props) => {
  return <ThreeModelAnimated {...props} rotation={[2, 0, 0.5]} url={close} />;
};

export default ThreeButtonNavigation;
