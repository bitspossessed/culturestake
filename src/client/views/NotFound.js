import React, { Fragment } from 'react';

import ColorSection from '~/client/components/ColorSection';
import Header from '~/client/components/Header';
import translate from '~/common/services/i18n';
import { ContainerStyle } from '~/client/styles/layout';
import { HeadingPrimaryStyle } from '~/client/styles/typography';

const NotFound = () => {
  return (
    <Fragment>
      <Header>
        <ContainerStyle>
          <ColorSection>
            <HeadingPrimaryStyle>
              {translate('NotFound.title')}
            </HeadingPrimaryStyle>
          </ColorSection>
        </ContainerStyle>
      </Header>
    </Fragment>
  );
};

export default NotFound;
