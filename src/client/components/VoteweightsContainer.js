import React from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Table, { ACTION_EDIT } from '~/client/components/Table';
import translate from '~/common/services/i18n';
import { getRequest } from '~/client/store/api/actions';
import { HeadingSecondaryStyle } from '~/client/styles/typography';
import styles from '~/client/styles/variables';
import swirl from '~/client/assets/images/swirl.svg';
import ButtonIcon from '~/client/components/ButtonIcon';

const table = {
  path: ['voteweights'],
  actions: [
    {
      label: translate('default.tableActionView'),
      key: ACTION_EDIT,
    },
  ],
  columns: [
    {
      key: 'name',
      isOrderKey: false,
      label: translate('VoteweightsTable.fieldName'),
    },
    {
      key: 'type',
      isOrderKey: false,
      label: translate('VoteweightsTable.fieldType'),
    },
  ],
};

const VoteweightsContainer = ({ festivalId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { slug } = useParams();

  const onSelect = ({ item }) => {
    history.push(`/admin/festivals/${slug}/voteweights/${item.id}`);

    dispatch(
      getRequest({
        path: ['voteweights', item.id],
      }),
    );
  };

  return (
    <VoteweightsContainerStyle>
      <HeadingSecondaryStyle>
        {translate('VoteweightsContainer.title')}
      </HeadingSecondaryStyle>
      <Table
        actions={table.actions}
        columns={table.columns}
        path={table.path}
        query={festivalId}
        queryParam="festivalId"
        onSelect={onSelect}
      />
      <ButtonIcon to={`/admin/festivals/${slug}/voteweights/new`} url={swirl}>
        {translate('VoteweightsContainer.buttonNewVoteweight')}
      </ButtonIcon>
    </VoteweightsContainerStyle>
  );
};

export const VoteweightsContainerStyle = styled.section`
  position: relative;

  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;

  border: 1.5px solid
    ${(props) => (props.disabled ? styles.colors.gray : styles.colors.violet)};
  border-radius: 20px;

  color: ${(props) =>
    props.disabled ? styles.colors.gray : styles.colors.violet};
`;

VoteweightsContainer.propTypes = {
  festivalId: PropTypes.number.isRequired,
};

export default VoteweightsContainer;
