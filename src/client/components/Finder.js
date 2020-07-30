import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useField } from 'react-form';

import apiRequest from '~/client/services/api';
import Spinner from '~/client/components/Spinner';
import InputFieldset from '~/client/components/InputFieldset';
import styles from '~/client/styles/variables';

const MAX_SEARCH_RESULTS = 5;

const Finder = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedSearchParam, setSelectedSearchParam] = useState('');
  const { meta, setValue } = useField(props.name);

  const onInputChange = (event) => {
    event.preventDefault();
    setSelectedSearchParam(event.target.value);
    setQuery(event.target.value);
  };

  const onSelect = (item) => {
    setSelectedSearchParam(item[props.searchParam]);
    setValue(item.id);
    setSearchResults([]);
  };

  const search = useCallback(
    async (query) => {
      setIsLoading(true);
      const queryObject = {};
      queryObject[props.searchParam] = `${query}`;
      const body = {
        ...props.defaultQuery,
        query: JSON.stringify(queryObject),
      };
      const response = await apiRequest({
        path: [`${props.queryPath}`],
        body,
      });

      const result = response.results
        .sort((itemA, itemB) => {
          return itemA[props.searchParam]
            .toLowerCase()
            .localeCompare(itemB[props.searchParam].toLowerCase());
        })
        .slice(0, MAX_SEARCH_RESULTS);

      setSearchResults(result);
      setIsLoading(false);
    },
    [props.queryPath, props.searchParam, props.defaultQuery],
  );

  useEffect(() => {
    setIsQueryEmpty(query.length === 0);

    if (query.length === 0) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    search(query);
  }, [query, search]);

  return (
    <Fragment>
      <InputFieldset label={props.label} meta={meta} name={props.name}>
        <InputFieldStyle
          label={props.label}
          name={props.name}
          placeholder={props.placeholder}
          type="text"
          value={selectedSearchParam}
          onChange={onInputChange}
        />
      </InputFieldset>

      <SpacingStyle>
        <ListStyle>
          <FinderResult
            isLoading={isLoading}
            isQueryEmpty={isQueryEmpty}
            items={searchResults}
            searchParam={props.searchParam}
            onClick={onSelect}
          />
        </ListStyle>
      </SpacingStyle>
    </Fragment>
  );
};

const FinderResult = (props) => {
  const onClick = (item) => {
    props.onClick(item);
  };

  if (props.isLoading) {
    return <Spinner />;
  }

  if (props.isQueryEmpty) {
    return null;
  }

  return props.items.map((item, index) => {
    return (
      <FinderItem
        key={index}
        searchParam={props.searchParam}
        selected={item}
        onClick={onClick}
      />
    );
  });
};

const FinderItem = (props) => {
  const onClick = () => {
    props.onClick(props.selected);
  };

  return (
    <ItemStyle onClick={onClick}>{props.selected[props.searchParam]}</ItemStyle>
  );
};

Finder.propTypes = {
  defaultQuery: PropTypes.object,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  queryPath: PropTypes.string.isRequired,
  searchParam: PropTypes.string.isRequired,
};

FinderResult.propTypes = {
  onClick: PropTypes.func.isRequired,
  searchParam: PropTypes.string.isRequired,
};

FinderItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  searchParam: PropTypes.string.isRequired,
  selected: PropTypes.object.isRequired,
};

const ListStyle = styled.ul`
  list-style: none;
`;

const ItemStyle = styled.li`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const InputFieldStyle = styled.input`
  width: 100%;

  padding: 1rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 20px;

  color: ${styles.colors.violet};

  background-color: transparent;
`;

const SpacingStyle = styled.div`
  margin-top: '5rem';
  margin-bottom: '5rem';
`;

export default Finder;
