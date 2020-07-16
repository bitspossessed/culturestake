import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-form';

// import debounce from '~/client/utils/debounce';
import apiRequest from '~/client/services/api';
import Pill from '~/client/components/Pill';
import Spinner from '~/client/components/Spinner';
// import { getRequest } from '~/client/store/api/actions';
// import ActionTypes from '~/client/store/tables/types';

import InputFieldset from '~/client/components/InputFieldset';
// import { SpacingStyle } from '~/styles/Layout';
import styles from '~/client/styles/variables';

const MAX_SEARCH_RESULTS = 5;

const Finder = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const { meta } = useFormContext();

  const onInputChange = (event) => {
    event.preventDefault();
    console.log('onInputChange'); // eslint-disable-line
    props.onInputChange(event.target.value);
    setQuery(event.target.value);
  };

  const onSelect = (item) => {
    setSelectedTitle(item.title);
    setSearchResults([]);
    props.onSelect(item);
  };

  const debouncedSearch = useCallback(
    async (query) => {
      // debounce(async (query) => {
      console.log('making req'); // eslint-disable-line

      const response = await apiRequest({
        path: [`${props.queryPath}`],
        body: { title: `${query}` },
      });
      console.log(response.results); // eslint-disable-line

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
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <Fragment>
      <InputFieldset label={'festival'} meta={meta} name={'festival'}>
        <InputFieldStyle
          label={'festival'}
          name={'festival'}
          placeholder={'choose a festival'}
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

  if (!props.isQueryEmpty && props.items.length === 0 && !props.isLoading) {
    return <Pill>{'idk what should this say'}</Pill>;
  }

  if (props.isLoading) {
    return <Spinner />;
  }

  if (props.isQueryEmpty) {
    return null;
  }

  return props.items.map((item, index) => {
    return <FinderItem key={index} user={item} onClick={onClick} />;
  });
};

const FinderItem = (props) => {
  const onClick = () => {
    props.onClick(props.user);
  };

  return <ItemStyle onClick={onClick}>{props.user.title}</ItemStyle>;
};

Finder.propTypes = {
  id: PropTypes.number.isRequired,
  input: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  queryPath: PropTypes.string.isRequired,
};

FinderResult.propTypes = {
  onClick: PropTypes.func.isRequired,
};

FinderItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
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
