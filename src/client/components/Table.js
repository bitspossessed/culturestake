import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  DEFAULT_LIMIT,
  DEFAULT_ORDER_DIRECTION,
  DEFAULT_ORDER_KEY,
  ORDER_DIRECTION_ASC,
  ORDER_DIRECTION_DESC,
  requestTable,
} from '~/client/store/tables/actions';

const DEFAULT_HEADERS = [
  {
    isOrderKey: true,
    key: 'id',
    label: 'ID',
  },
];

export const ACTION_DESTROY = Symbol('select-destroy');
export const ACTION_EDIT = Symbol('select-edit');
export const ACTION_SELECT = Symbol('select-action');

const Table = ({
  actions,
  columns,
  initialOrderDirection = DEFAULT_ORDER_DIRECTION,
  initialOrderKey = DEFAULT_ORDER_KEY,
  pageSize = DEFAULT_LIMIT,
  pageIndex,
  path,
  onSelect,
}) => {
  const dispatch = useDispatch();

  const [orderDirection, setOrderDirection] = useState(initialOrderDirection);
  const [orderKey, setOrderKey] = useState(initialOrderKey);

  const tables = useSelector(state => state.tables);

  const pathString = path.join('/');
  const colSpan = DEFAULT_HEADERS.length + columns.length + 1;

  useEffect(() => {
    dispatch(
      requestTable({
        orderDirection,
        orderKey,
        pageSize,
        pageIndex,
        path,
      }),
    );
  }, [pathString, pageIndex, orderKey, orderDirection]);

  const onSelectHeader = ({ key }) => {
    if (orderKey === key) {
      setOrderDirection(
        orderDirection === ORDER_DIRECTION_ASC
          ? ORDER_DIRECTION_DESC
          : ORDER_DIRECTION_ASC,
      );
    } else {
      setOrderKey(key);
      setOrderDirection(DEFAULT_ORDER_DIRECTION);
    }
  };

  const onSelectRow = event => {
    onSelect(event);
  };

  const onSelectPage = item => {
    onSelect(item);
  };

  return (
    <table>
      <TableHeader
        columns={columns}
        orderDirection={tables.orderDirection}
        orderKey={tables.orderKey}
        onSelect={onSelectHeader}
      />

      <TableBody
        actions={actions}
        colSpan={colSpan}
        columns={columns}
        isError={tables.isError}
        isLoading={tables.isLoading}
        results={tables.results}
        onSelect={onSelectRow}
      />

      <TableFooter
        colSpan={colSpan}
        isLoading={tables.isLoading}
        isSuccess={tables.isSuccess}
        pageIndex={pageIndex}
        pagesTotal={tables.pagesTotal}
        onSelect={onSelectPage}
      />
    </table>
  );
};

export const TableHeader = ({
  columns,
  orderDirection,
  orderKey,
  onSelect,
}) => {
  return (
    <thead>
      <tr>
        <th>#</th>
        {DEFAULT_HEADERS.concat(columns).map(({ label, key, isOrderKey }) => {
          return (
            <TableHeaderItem
              isOrderKey={isOrderKey}
              isSelected={orderKey === key}
              key={`th-${key}`}
              label={label}
              orderDirection={orderDirection}
              orderKey={key}
              onSelect={onSelect}
            />
          );
        })}
        <th>Actions</th>
      </tr>
    </thead>
  );
};

export const TableHeaderItem = ({
  isOrderKey,
  isSelected,
  label,
  orderDirection,
  orderKey,
  onSelect,
}) => {
  if (!isOrderKey) {
    return <th>{label}</th>;
  }

  const onSelectOrder = () => {
    onSelect({
      key: orderKey,
      label,
    });
  };

  let orderStr = '';

  if (isSelected) {
    if (orderDirection === ORDER_DIRECTION_ASC) {
      orderStr += ' ↑';
    } else {
      orderStr += ' ↓';
    }
  }

  return (
    <th onClick={onSelectOrder}>
      {label}
      {orderStr}
    </th>
  );
};

export const TableBody = ({
  actions,
  colSpan,
  columns,
  isError,
  isLoading,
  results,
  onSelect,
}) => {
  if (isLoading) {
    // @TODO: Use i18n
    return <TableBodyMessage colSpan={colSpan}>Loading ...</TableBodyMessage>;
  }

  if (isError) {
    // @TODO: Use i18n
    return (
      <TableBodyMessage colSpan={colSpan}>
        Something went wrong ...
      </TableBodyMessage>
    );
  }

  return (
    <tbody>
      {results.map((item, index) => {
        const onSelectAction = type => {
          onSelect({
            type,
            item,
          });
        };

        const onSelectItem = () => {
          onSelect({
            type: ACTION_SELECT,
            item,
          });
        };

        return (
          <tr key={`tr-${item.id}`} onClick={onSelectItem}>
            <td>{index}</td>
            <TableBodyItems columns={columns} values={item} />
            <td>
              <TableActions actions={actions} onSelect={onSelectAction} />
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export const TableBodyMessage = ({ children, colSpan }) => {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan}>{children}</td>
      </tr>
    </tbody>
  );
};

export const TableBodyItems = ({ columns, values }) => {
  return DEFAULT_HEADERS.concat(columns).map(column => {
    return <td key={`td-${values.id}-${column.key}`}>{values[column.key]}</td>;
  });
};

export const TableActions = ({ actions, onSelect }) => {
  return actions.map((action, index) => {
    const onSelectAction = event => {
      event.stopPropagation();
      onSelect(action.key);
    };

    return (
      <button key={`action-${index}`} onClick={onSelectAction}>
        {action.label}
      </button>
    );
  });
};

export const TableFooter = ({
  colSpan,
  isLoading,
  isSuccess,
  pageIndex,
  pagesTotal,
  onSelect,
}) => {
  const isDisabled = isLoading || !isSuccess;
  const isPreviousDisabled = isDisabled || pageIndex === 0;
  const isNextDisabled = isDisabled || pageIndex === pagesTotal - 1;

  const onClickPrevious = () => {
    onSelect(pageIndex - 1);
  };

  const onClickNext = () => {
    onSelect(pageIndex + 1);
  };

  return (
    <tfoot>
      <tr>
        <td colSpan={colSpan}>
          <button disabled={isPreviousDisabled} onClick={onClickPrevious}>
            &lt;
          </button>

          <button disabled={isNextDisabled} onClick={onClickNext}>
            &gt;
          </button>
        </td>
      </tr>
    </tfoot>
  );
};

const PropTypesAction = PropTypes.shape({
  key: PropTypes.symbol.isRequired,
  label: PropTypes.string.isRequired,
});

const PropTypesColumn = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isOrderKey: PropTypes.bool.isRequired,
});

const PropTypesOrderDirections = PropTypes.oneOf([
  ORDER_DIRECTION_ASC,
  ORDER_DIRECTION_DESC,
]);

Table.propTypes = {
  actions: PropTypes.arrayOf(PropTypesAction).isRequired,
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
  initialOrderDirection: PropTypesOrderDirections,
  initialOrderKey: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
};

TableBody.propTypes = {
  actions: PropTypes.arrayOf(PropTypesAction).isRequired,
  colSpan: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
  isError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
};

TableBodyMessage.propTypes = {
  children: PropTypes.node.isRequired,
  colSpan: PropTypes.number.isRequired,
};

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
  onSelect: PropTypes.func.isRequired,
  orderDirection: PropTypesOrderDirections.isRequired,
  orderKey: PropTypes.string.isRequired,
};

TableHeaderItem.propTypes = {
  isOrderKey: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  orderDirection: PropTypesOrderDirections.isRequired,
  orderKey: PropTypes.string.isRequired,
};

TableFooter.propTypes = {
  colSpan: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSuccess: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  pageIndex: PropTypes.number.isRequired,
  pagesTotal: PropTypes.number.isRequired,
};

export default Table;
