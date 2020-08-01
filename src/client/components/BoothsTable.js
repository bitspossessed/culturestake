import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  TableStyle,
  TableHeaderStyle,
  TableHeaderItemStyle,
  TableBodyStyle,
  TableBodyMessageStyle,
} from '~/client/components/Table';
import ButtonOutline from '~/client/components/ButtonOutline';
import translate from '~/common/services/i18n';
import requestGraph, { boothsQuery } from '~/common/services/subgraph';
import {
  TX_INITIALIZE_BOOTH,
  TX_DEACTIVATE_BOOTH,
} from '~/common/services/contracts/booths';
import { usePendingTransaction } from '~/client/hooks/ethereum';

const BoothsTable = ({ actions, columns, isOwner, onSelect }) => {
  const [booths, setBooths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeTx = usePendingTransaction({
    txMethod: TX_INITIALIZE_BOOTH,
  });
  const deactivateTx = usePendingTransaction({
    txMethod: TX_DEACTIVATE_BOOTH,
  });

  useEffect(() => {
    const getBooths = async () => {
      const booths = await requestGraph(boothsQuery(), {});
      setBooths(booths);
      setIsLoading(false);
    };
    getBooths();
  }, [setBooths, initializeTx.isPending, deactivateTx.isPending]);

  return (
    <TableStyle>
      <TableHeader actions={actions} columns={columns} isOwner={isOwner} />

      <TableBody
        actions={actions}
        columns={columns}
        isLoading={isLoading}
        isOwner={isOwner}
        results={booths.votingBooths ? booths.votingBooths : []}
        onSelect={onSelect}
      />
    </TableStyle>
  );
};

export const TableHeader = ({ columns, isOwner }) => {
  return (
    <TableHeaderStyle>
      <tr>
        <TableHeaderItemStyle>#</TableHeaderItemStyle>
        {columns.map(({ label, key }) => {
          return <TableHeaderItem key={`th-${key}`} label={label} />;
        })}
        {isOwner ? <TableHeaderItemStyle>Actions</TableHeaderItemStyle> : null}
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
  isOwner,
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
    <TableBodyOverflowStyle>
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
            {isOwner ? (
              <td>
                {!item.deactivated ? (
                  <TableActions actions={actions} onSelect={onSelectAction} />
                ) : (
                  translate('BoothsTable.alreadyDeactivated')
                )}
              </td>
            ) : null}
          </tr>
        );
      })}
    </TableBodyOverflowStyle>
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
      <ButtonOutline
        isDangerous={true}
        key={`action-${index}`}
        onClick={onSelectAction}
      >
        {action.label}
      </ButtonOutline>
    );
  });
};

const TableBodyOverflowStyle = styled(TableBodyStyle)`
  td {
    overflow: hidden;

    max-width: 12rem;
    text-overflow: ellipsis;

    white-space: nowrap;
  }
`;

const PropTypesColumn = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});

const PropTypesAction = PropTypes.shape({
  label: PropTypes.string.isRequired,
});

BoothsTable.propTypes = {
  actions: PropTypes.arrayOf(PropTypesAction).isRequired,
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
  isOwner: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  searchParams: PropTypes.object,
};

TableBody.propTypes = {
  actions: PropTypes.arrayOf(PropTypesAction).isRequired,
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
};

TableBodyMessage.propTypes = {
  children: PropTypes.node.isRequired,
};

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
  isOwner: PropTypes.bool.isRequired,
};

TableHeaderItem.propTypes = {
  label: PropTypes.string.isRequired,
};

export default BoothsTable;
