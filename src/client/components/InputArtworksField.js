import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';

import ButtonOutline from '~/client/components/ButtonOutline';
import Finder from '~/client/components/Finder';
import InputFieldsetRounded from '~/client/components/InputFieldsetRounded';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { useField } from '~/client/hooks/forms';

const InputArtworksField = ({ label, name, validate }) => {
  const [finderValue, setFinderValue] = useState(null);

  const { meta, setValue, value } = useField(name, {
    validate,
    defaultValue: [],
  });

  const onAdd = (artworkId) => {
    if (!artworkId) {
      return;
    }

    setValue(value.concat([artworkId]));
    setFinderValue(null);
  };

  const onRemove = (artworkId) => {
    setValue(value.filter((artwork) => artwork.id !== artworkId));
  };

  const filterDuplicates = (artwork) => {
    return !value.find(({ id }) => id === artwork.id);
  };

  return (
    <InputFieldsetRounded label={label} meta={meta} name={name}>
      <InputArtworksFieldItems artworks={value} onRemove={onRemove} />

      <Finder
        clientSideFilter={filterDuplicates}
        label={translate('InputArtworksField.fieldArtwork')}
        name="artworkId"
        placeholder={translate('InputArtworksField.fieldArtworkPlaceholder')}
        queryPath={['artworks']}
        searchParam={'title'}
        value={finderValue}
        onChange={onAdd}
      />
    </InputFieldsetRounded>
  );
};

const InputArtworksFieldItems = ({ artworks, onRemove }) => {
  return (
    <InputArtworksFieldItemsStyle>
      {artworks.map((artwork, index) => {
        const onClickRemove = () => {
          onRemove(artwork.id);
        };

        return (
          <InputArtworksFieldItemStyle key={index}>
            <InputArtworksFieldItemTextStyle>
              {artwork.title}
            </InputArtworksFieldItemTextStyle>

            <ButtonOutline disabled={!artwork.id} onClick={onClickRemove}>
              {translate('InputUploadField.buttonRemoveFile')}
            </ButtonOutline>
          </InputArtworksFieldItemStyle>
        );
      })}
    </InputArtworksFieldItemsStyle>
  );
};

const InputArtworksFieldItemsStyle = styled.ul`
  padding: 0;

  list-style: none;
`;

const InputArtworksFieldItemStyle = styled.li`
  display: flex;

  padding: 1rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 20px;

  color: ${styles.colors.violet};

  align-items: center;
  justify-content: space-between;

  & + & {
    margin-top: 1rem;
  }
`;

const InputArtworksFieldItemTextStyle = styled.span``;

InputArtworksField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

InputArtworksFieldItems.propTypes = {
  artworks: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default InputArtworksField;
