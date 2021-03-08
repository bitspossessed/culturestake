import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Spinner from '~/client/components/Spinner';
import apiRequest from '~/client/services/api';
import styles from '~/client/styles/variables';
import { InputFieldStyle } from '~/client/components/InputField';

const MAX_SEARCH_RESULTS = 5;

const Finder = ({
  clientSideFilter,
  defaultQuery,
  isDisabled = false,
  label,
  name,
  placeholder,
  queryPath,
  searchParam,
  selectParam = searchParam,
  onChange,
  value,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSearchParam, setSelectedSearchParam] = useState('');
  const [query, setQuery] = useState('');

  const onInputChange = (event) => {
    event.preventDefault();

    setSelectedSearchParam(event.target.value);
    setQuery(event.target.value);
    onChange(null);
  };

  const onSelect = (item) => {
    onChange(item);
    setQuery('');
    setSearchResults([]);
    setSelectedSearchParam('');
  };

  useEffect(() => {
    const resolve = async (item) => {
      const resources = await apiRequest({
        path: queryPath,
        body: {
          ...defaultQuery,
          query: typeof item === 'object' ? item[selectParam] : item,
          queryParam: selectParam,
        },
      });

      if (resources.results.length > 0) {
        setSelectedSearchParam(resources.results[0][searchParam]);
      }
    };

    if (value) {
      resolve(value);
    } else {
      setSelectedSearchParam('');
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsLoading(true);

    const search = async (query) => {
      const response = await apiRequest({
        path: queryPath,
        body: {
          ...defaultQuery,
          query,
          queryParam: searchParam,
        },
      });

      const result = response.results
        .sort((itemA, itemB) => {
          return itemA[searchParam]
            .toLowerCase()
            .localeCompare(itemB[searchParam].toLowerCase());
        })
        .slice(0, MAX_SEARCH_RESULTS);

      const filtered = clientSideFilter
        ? result.filter(clientSideFilter)
        : result;

      setSearchResults(filtered);
      setIsLoading(false);
    };

    setIsQueryEmpty(query.length === 0);

    if (query.length === 0) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    search(query);
  }, [query, value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FinderStyle>
      {isLoading && (
        <FinderSpinnerStyle>
          <Spinner />
        </FinderSpinnerStyle>
      )}

      <InputFieldStyle
        autoComplete="off"
        isDisabled={isDisabled}
        label={label}
        name={name}
        placeholder={placeholder}
        type="text"
        value={selectedSearchParam}
        onChange={onInputChange}
      />

      <FinderResult
        isLoading={isLoading}
        isQueryEmpty={isQueryEmpty}
        items={searchResults}
        searchParam={searchParam}
        onClick={onSelect}
      />
    </FinderStyle>
  );
};

const FinderResult = (props) => {
  if (props.items.length === 0) {
    return null;
  }

  if (props.isQueryEmpty) {
    return null;
  }

  return (
    <FinderResultStyle>
      {props.items.map((item, index) => {
        return (
          <FinderResultItem
            key={index}
            searchParam={props.searchParam}
            selectedItem={item}
            onClick={props.onClick}
          />
        );
      })}
    </FinderResultStyle>
  );
};

const FinderResultItem = (props) => {
  const onClick = () => {
    props.onClick(props.selectedItem);
  };

  return (
    <FinderResultItemStyle onClick={onClick}>
      {props.selectedItem[props.searchParam]}
    </FinderResultItemStyle>
  );
};

Finder.propTypes = {
  clientSideFilter: PropTypes.func,
  defaultQuery: PropTypes.object,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  queryPath: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchParam: PropTypes.string.isRequired,
  selectParam: PropTypes.string,
  value: PropTypes.any,
};

FinderResult.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isQueryEmpty: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  searchParam: PropTypes.string.isRequired,
};

FinderResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  searchParam: PropTypes.string.isRequired,
  selectedItem: PropTypes.object.isRequired,
};

const FinderStyle = styled.div`
  position: relative;
`;

const FinderSpinnerStyle = styled.div`
  position: absolute;

  right: 0;
`;

const FinderResultStyle = styled.ul`
  padding: 0;

  list-style: none;
`;

const FinderResultItemStyle = styled.li`
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 3px;

  color: ${styles.colors.violet};

  cursor: pointer;

  &:hover {
    color: ${styles.colors.white};

    background-color: ${styles.colors.violet};
  }

  &::before {
    display: inline;

    padding-right: 0.25rem;

    content: '★';
  }
`;

export default Finder;
