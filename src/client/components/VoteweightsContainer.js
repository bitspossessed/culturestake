import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Table, { ACTION_DESTROY } from '~/client/components/Table';
import translate from '~/common/services/i18n';
import { destroyRequest } from '~/client/store/api/actions';
import { HeadingSecondaryStyle } from '~/client/styles/typography';
import styles from '~/client/styles/variables';
import swirl from '~/client/assets/images/swirl.svg';
import ButtonIcon from '~/client/components/ButtonIcon';

const table = {
  path: ['voteweights'],
  actions: [
    {
      label: translate('VoteweightsTable.buttonDelete'),
      isDangerous: true,
      key: ACTION_DESTROY,
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
  const { slug } = useParams();

  const onSelect = ({ item }) => {
    if (!window.confirm(translate('default.areYouSure'))) {
      return;
    }

    dispatch(
      destroyRequest({
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
