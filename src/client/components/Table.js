import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ButtonOutline from '~/client/components/ButtonOutline';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { getCached } from '~/client/services/cache';
import { useResourceId } from '~/client/hooks/requests';
import {
  DEFAULT_LIMIT,
  DEFAULT_ORDER_DIRECTION,
  DEFAULT_ORDER_KEY,
  ORDER_DIRECTION_ASC,
  ORDER_DIRECTION_DESC,
  requestTable,
} from '~/client/store/tables/actions';

export const PARAM_PAGE_INDEX = 'page';

export const ACTION_DESTROY = Symbol('select-destroy');
export const ACTION_EDIT = Symbol('select-edit');
export const ACTION_SELECT = Symbol('select-action');

const DEFAULT_HEADERS = [
  {
    isOrderKey: true,
    key: 'id',
    label: 'ID',
  },
  {
    isOrderKey: true,
    isDate: true,
    key: 'createdAt',
    label: translate('Table.columnCreatedAt'),
  },
  {
    isOrderKey: true,
    isDate: true,
    key: 'updatedAt',
    label: translate('Table.columnUpdatedAt'),
  },
];

const Table = ({
  actions,
  columns,
  initialOrderDirection = DEFAULT_ORDER_DIRECTION,
  initialOrderKey = DEFAULT_ORDER_KEY,
  pageSize = DEFAULT_LIMIT,
  path,
  query,
  queryParam,
  onSelect,
}) => {
  const dispatch = useDispatch();
  const requestId = useResourceId(path);

  const location = useLocation();
  const history = useHistory();

  const [orderDirection, setOrderDirection] = useState(initialOrderDirection);
  const [orderKey, setOrderKey] = useState(initialOrderKey);

  const tables = useSelector(
    (state) =>
      state.tables.requests[requestId] || {
        isError: false,
        isLoading: true,
        isSuccess: false,
        orderDirection: initialOrderDirection,
        orderKey: initialOrderKey,
        pageIndex: 0,
        pageSize,
        pagesTotal: 1,
      },
  );

  const results = useMemo(() => {
    if (tables.isSuccess) {
      return getCached(requestId).results;
    }

    return [];
  }, [tables.isSuccess, requestId]);

  const pathString = path.join('/');
  const colSpan = DEFAULT_HEADERS.length + columns.length + 1;

  // Find out if current page is set as an query parameter
  let pageIndex = 0;

  try {
    const urlParams = new URLSearchParams(location.search);

    if (urlParams.has(PARAM_PAGE_INDEX)) {
      const pageParam = parseInt(urlParams.get(PARAM_PAGE_INDEX), 10);

      if (pageParam > 1) {
        pageIndex = pageParam - 1;
      }
    }
  } catch {
    // Do nothing ..
  }

  // Check for changes in the resource path or
  // pagination variables to request an update from the server
  useEffect(() => {
    dispatch(
      requestTable({
        orderDirection,
        orderKey,
        pageIndex,
        pageSize,
        path,
        query,
        queryParam,
        requestId,
      }),
    );
  }, [
    dispatch,
    orderDirection,
    orderKey,
    pageIndex,
    pageSize,
    path,
    pathString,
    query,
    queryParam,
    requestId,
  ]);

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

  const onSelectRow = (event) => {
    onSelect(event);
  };

  const onSelectPage = (nextPageIndex) => {
    history.push(
      `${location.pathname}?${PARAM_PAGE_INDEX}=${nextPageIndex + 1}`,
    );
  };

  return (
    <TableStyle>
      <TableHeader
        actions={actions}
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
        offset={tables.pageSize * tables.pageIndex}
        results={results}
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
    </TableStyle>
  );
};

export const TableHeader = ({
  columns,
  orderDirection,
  orderKey,
  onSelect,
  actions,
}) => {
  return (
    <TableHeaderStyle>
      <tr>
        <TableHeaderItemStyle>#</TableHeaderItemStyle>
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
        {actions.length !== 0 ? (
          <TableHeaderItemStyle>Actions</TableHeaderItemStyle>
        ) : null}
      </tr>
    </TableHeaderStyle>
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
    return <TableHeaderItemStyle>{label}</TableHeaderItemStyle>;
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
      orderStr += '↑';
    } else {
      orderStr += '↓';
    }
  }

  return (
    <TableHeaderItemStyle
      isSelectable
      isSelected={isSelected}
      onClick={onSelectOrder}
    >
      {label}&nbsp;{orderStr}
    </TableHeaderItemStyle>
  );
};

export const TableBody = ({
  actions,
  colSpan,
  columns,
  isError,
  isLoading,
  offset,
  results,
  onSelect,
}) => {
  if (isLoading) {
    return (
      <TableBodyMessage colSpan={colSpan}>
        {translate('Table.bodyLoading')}
      </TableBodyMessage>
    );
  }

  if (!isLoading && !isError && results.length === 0) {
    return (
      <TableBodyMessage colSpan={colSpan}>
        {translate('Table.bodyEmpty')}
      </TableBodyMessage>
    );
  }

  if (isError) {
    return (
      <TableBodyMessage colSpan={colSpan}>
        {translate('Table.bodyError')}
      </TableBodyMessage>
    );
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

        const onSelectItem = () => {
          onSelect({
            type: ACTION_SELECT,
            item,
          });
        };

        return (
          <tr key={`tr-${item.id}`} onClick={onSelectItem}>
            <td>{index + offset + 1}</td>
            <TableBodyItems columns={columns} values={item} />
            <td>
              {actions.length !== 0 ? (
                <TableActions actions={actions} onSelect={onSelectAction} />
              ) : null}
            </td>
          </tr>
        );
      })}
    </TableBodyStyle>
  );
};

export const TableBodyMessage = ({ children, colSpan }) => {
  return (
    <TableBodyMessageStyle>
      <tr>
        <td colSpan={colSpan}>{children}</td>
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
  return DEFAULT_HEADERS.concat(columns).map((column) => {
    const value = column.isDate
      ? DateTime.fromISO(values[column.key]).toFormat('dd.MM.yyyy HH:mm')
      : getNestedColumn(values, column.key);

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
        isDanger={action.isDangerous}
        key={`action-${index}`}
        onClick={onSelectAction}
      >
        {action.label}
      </ButtonOutline>
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
  const isNextDisabled = isDisabled || pageIndex >= pagesTotal - 1;

  const onClickPrevious = () => {
    onSelect(pageIndex - 1);
  };

  const onClickNext = () => {
    onSelect(pageIndex + 1);
  };

  return (
    <TableFooterStyle>
      <tr>
        <td colSpan={colSpan}>
          <ButtonOutline
            disabled={isPreviousDisabled}
            onClick={onClickPrevious}
          >
            &lt;
          </ButtonOutline>

          <ButtonOutline disabled={isNextDisabled} onClick={onClickNext}>
            &gt;
          </ButtonOutline>
        </td>
      </tr>
    </TableFooterStyle>
  );
};

export const TableStyle = styled.table`
  width: 100%;

  td {
    padding: 1rem;

    color: ${styles.colors.violet};
  }
`;

export const TableHeaderStyle = styled.thead``;

export const TableHeaderItemStyle = styled.th`
  padding: 1rem;

  border-bottom: 1.5px solid ${styles.colors.violet};

  color: ${(props) =>
    props.isSelected ? styles.colors.white : styles.colors.violet};

  background-color: ${(props) =>
    props.isSelected ? styles.colors.violet : 'transparent'};

  cursor: ${(props) => (props.isSelectable ? 'pointer' : null)};
`;

export const TableBodyStyle = styled.tbody`
  tr {
    cursor: pointer;
    &:hover {
      background-color: ${styles.colors.grayLight};
    }
  }
`;

export const TableBodyMessageStyle = styled.tbody``;

const TableFooterStyle = styled.tfoot`
  tr {
    margin-top: 1rem;
  }
`;

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
  pageSize: PropTypes.number,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  query: PropTypes.any,
  queryParam: PropTypes.string,
};

TableBody.propTypes = {
  actions: PropTypes.arrayOf(PropTypesAction).isRequired,
  colSpan: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(PropTypesColumn).isRequired,
  isError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
};

TableBodyMessage.propTypes = {
  children: PropTypes.node.isRequired,
  colSpan: PropTypes.number.isRequired,
};

TableHeader.propTypes = {
  actions: PropTypes.arrayOf(PropTypesAction).isRequired,
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
