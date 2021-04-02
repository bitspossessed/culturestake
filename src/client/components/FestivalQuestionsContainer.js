import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import translate from '~/common/services/i18n';
import { HeadingSecondaryStyle } from '~/client/styles/typography';
import styles from '~/client/styles/variables';
import swirl from '~/client/assets/images/swirl.svg';
import ButtonIcon from '~/client/components/ButtonIcon';
import Table, { ACTION_EDIT } from '~/client/components/Table';
import { getRequest } from '~/client/store/api/actions';

const table = {
  path: ['questions'],
  columns: [
    {
      isOrderKey: true,
      key: 'title',
      label: translate('AdminQuestions.fieldTitle'),
    },
  ],
  actions: [
    {
      label: translate('default.tableActionEdit'),
      key: ACTION_EDIT,
    },
  ],
};

const FestivalQuestionsContainer = ({ festivalId }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const onSelect = ({ item: { id } }) => {
    history.push(`/admin/festivals/${slug}/questions/${id}/edit`);

    dispatch(
      getRequest({
        path: ['questions', id],
      }),
    );
  };

  return (
    <QuestionsContainerStyle>
      <HeadingSecondaryStyle>
        {translate('FestivalQuestionsContainer.title')}
      </HeadingSecondaryStyle>
      <Table
        actions={table.actions}
        columns={table.columns}
        path={table.path}
        query={festivalId}
        queryParam="festivalId"
        onSelect={onSelect}
      />

      <ButtonIcon to={`/admin/festivals/${slug}/questions/new`} url={swirl}>
        {translate('FestivalQuestionsContainer.buttonNew')}
      </ButtonIcon>
    </QuestionsContainerStyle>
  );
};

export const QuestionsContainerStyle = styled.section`
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

FestivalQuestionsContainer.propTypes = {
  festivalId: PropTypes.number.isRequired,
};

export default FestivalQuestionsContainer;
