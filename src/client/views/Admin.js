import React, { Fragment } from 'react';
import styled from 'styled-components';

import BoxRounded from '~/client/components/BoxRounded';
import ButtonOutline, {
  ButtonOutlineStyle,
} from '~/client/components/ButtonOutline';
import ContractsOwners from '~/client/components/ContractsOwners';
import HeaderAdmin from '~/client/components/HeaderAdmin';
import PayerBalance from '~/client/components/PayerBalance';
import ViewAdmin from '~/client/components/ViewAdmin';
import translate from '~/common/services/i18n';
import { ParagraphStyle } from '~/client/styles/typography';

const Admin = () => {
  return (
    <Fragment>
      <HeaderAdmin>{translate('Admin.title')}</HeaderAdmin>

      <ViewAdmin>
        <BoxRounded title={translate('Admin.titleNavigation')}>
          <AdminNavigationStyle>
            <ButtonOutline to="/admin/users">
              {translate('Admin.linkAdminUsers')}
            </ButtonOutline>

            <ButtonOutline to="/admin/festivals">
              {translate('Admin.linkAdminFestivals')}
            </ButtonOutline>

            <ButtonOutline to="/admin/booths">
              {translate('Admin.linkAdminBooths')}
            </ButtonOutline>

            <ButtonOutline to="/admin/artists">
              {translate('Admin.linkAdminArtists')}
            </ButtonOutline>

            <ButtonOutline to="/admin/artworks">
              {translate('Admin.linkAdminArtworks')}
            </ButtonOutline>

            <ButtonOutline to="/admin/organisations">
              {translate('Admin.linkAdminOrganisations')}
            </ButtonOutline>

            <ButtonOutline to="/admin/properties">
              {translate('Admin.linkAdminProperties')}
            </ButtonOutline>

            <ButtonOutline to="/admin/questions">
              {translate('Admin.linkAdminQuestions')}
            </ButtonOutline>
          </AdminNavigationStyle>
        </BoxRounded>

        <PayerBalance />
        <ContractsOwners />
        <ParagraphStyle>v{process.env.RELEASE_VERSION}</ParagraphStyle>
      </ViewAdmin>
    </Fragment>
  );
};

const AdminNavigationStyle = styled.div`
  display: flex;

  flex-wrap: wrap;
  justify-content: space-evenly;

  a {
    display: block;

    width: 12rem;

    margin: 0.5rem;
  }

  ${ButtonOutlineStyle} {
    width: 100%;
    height: 6rem;

    border-radius: 10px;
  }
`;

export default Admin;
