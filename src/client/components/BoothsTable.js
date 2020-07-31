import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import ButtonOutline from '~/client/components/ButtonOutline';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import requestGraph, { boothsQuery } from '~/common/services/subgraph';

const Table = ({ actions, columns, onSelect }) => {
  const [booths, setBooths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBooths = async () => {
      const booths = await requestGraph(boothsQuery(), {});
      setBooths(booths);
      setIsLoading(false);
    };
    getBooths();
  }, [setBooths]);

  return (
    <TableStyle>
      <TableHeader actions={actions} columns={columns} />

      <TableBody
        actions={actions}
        columns={columns}
        isLoading={isLoading}
        results={booths.votingBooths ? booths.votingBooths : []}
        onSelect={onSelect}
      />
    </TableStyle>
  );
};

export const TableHeader = ({ columns, actions }) => {
  return (
    <TableHeaderStyle>
      <tr>
        <TableHeaderItemStyle>#</TableHeaderItemStyle>
        {columns.map(({ label, key }) => {
          return <TableHeaderItem key={`th-${key}`} label={label} />;
        })}
        {actions.length !== 0 ? (
          <TableHeaderItemStyle>Actions</TableHeaderItemStyle>
        ) : null}
      </tr>
    </TableHeaderStyle>
  );
};

export const TableHeaderItem = ({ label }) => {
  return <TableHeaderItemStyle>{label}</TableHeaderItemStyle>;
};

export const TableBody = ({
  actions,
  columns,
  isLoading,
  results,
  onSelect,
}) => {
  if (isLoading) {
    return (
      <TableBodyMessage>{translate('Table.bodyLoading')}</TableBodyMessage>
    );
  }

  if (!isLoading && results.length === 0) {
    return <TableBodyMessage>{translate('Table.bodyEmpty')}</TableBodyMessage>;
  }

  return (
    <TableBodyStyle>
      {results.map((item, index) => {
        const onSelectAction = (type) => {
          onSelect({
            type,
            item,
          });
        };

        return (
          <tr key={`tr-${item.id}`}>
            <td>{index + 1}</td>
            <TableBodyItems columns={columns} values={item} />
            <td>
              <TableActions actions={actions} onSelect={onSelectAction} />
            </td>
          </tr>
        );
      })}
    </TableBodyStyle>
  );
};

export const TableBodyMessage = ({ children }) => {
  return (
    <TableBodyMessageStyle>
      <tr>
        <td>{children}</td>
      </tr>
    </TableBodyMessageStyle>
  );
};

// support using associations as column
function getNestedColumn(values, path) {
  path = path.split('.');
  let value = values;
  for (var i = 0; i < path.length; i++) {
    value = value ? value[path[i]] : value;
  }
  return value;
}

export const TableBodyItems = ({ columns, values }) => {
  return columns.map((column) => {
    const value = getNestedColumn(values, column.key);
    return <td key={`td-${values.id}-${column.key}`}>{value}</td>;
  });
};

export const TableActions = ({ actions, onSelect }) => {
  return actions.map((action, index) => {
    const onSelectAction = (event) => {
      event.stopPropagation();
      onSelect(action.key);
    };

    return (
      <ButtonOutline key={`action-${index}`} onClick={onSelectAction}>
        {action.label}
      </ButtonOutline>
    );
  });
};

const TableStyle = styled.table`
  width: 100%;

  td {
    padding: 1rem;

    color: ${styles.colors.violet};
  }
`;

const TableHeaderStyle = styled.thead``;

const TableHeaderItemStyle = styled.th`
  padding: 1rem;

  border-bottom: 1.5px solid ${styles.colors.violet};

  color: ${(props) =>
    props.isSelected ? styles.colors.white : styles.colors.violet};

  background-color: ${(props) =>
    props.isSelected ? styles.colors.violet : 'transparent'};

  cursor: ${(props) => (props.isSelectable ? 'pointer' : null)};
`;

const TableBodyStyle = styled.tbody`
  tr {
    cursor: pointer;
    &:hover {
      background-color: ${styles.colors.grayLight};
    }
  }
`;

const TableBodyMessageStyle = styled.tbody``;

const PropTypesColumn = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});

const PropTypesAction = PropTypes.shape({
  label: PropTypes.string.isRequired,
});

Table.propTypes = {
  actions: PropTypes.arrayOf(PropTypesAction).isRequired,
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
  onSelect: PropTypes.func.isRequired,
  searchParams: PropTypes.object,
};

TableBody.propTypes = {
  actions: PropTypes.arrayOf(PropTypesAction).isRequired,
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
};

TableBodyMessage.propTypes = {
  children: PropTypes.node.isRequired,
};

TableHeader.propTypes = {
  actions: PropTypes.arrayOf(PropTypesAction).isRequired,
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
};

TableHeaderItem.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Table;
