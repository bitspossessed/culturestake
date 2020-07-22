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
  const [selectedTitle, setSelectedTitle] = useState('');
  const { meta, setValue } = useField(props.name);

  const onInputChange = (event) => {
    event.preventDefault();
    setSelectedTitle(event.target.value);
    setQuery(event.target.value);
  };

  const onSelect = (item) => {
    setSelectedTitle(item.title);
    setValue(item.id);
    setSearchResults([]);
  };

  const search = useCallback(
    async (query) => {
      setIsLoading(true);
      const response = await apiRequest({
        path: [`${props.queryPath}`],
        body: { title: `${query}` },
      });

      const result = response.results
        .sort((itemA, itemB) => {
          return itemA.title
            .toLowerCase()
            .localeCompare(itemB.title.toLowerCase());
        })
        .slice(0, MAX_SEARCH_RESULTS);

      setSearchResults(result);
      setIsLoading(false);
    },
    [props.queryPath],
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
          value={selectedTitle}
          onChange={onInputChange}
        />
      </InputFieldset>

      <SpacingStyle>
        <ListStyle>
          <FinderResult
            isLoading={isLoading}
            isQueryEmpty={isQueryEmpty}
            items={searchResults}
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
    return <FinderItem key={index} selected={item} onClick={onClick} />;
  });
};

const FinderItem = (props) => {
  const onClick = () => {
    props.onClick(props.selected);
  };

  return <ItemStyle onClick={onClick}>{props.selected.title}</ItemStyle>;
};

Finder.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  queryPath: PropTypes.string.isRequired,
};

FinderResult.propTypes = {
  onClick: PropTypes.func.isRequired,
};

FinderItem.propTypes = {
  onClick: PropTypes.func.isRequired,
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
