import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import ButtonOutline from '~/client/components/ButtonOutline';
import InputFieldsetRounded from '~/client/components/InputFieldsetRounded';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { useField } from '~/client/hooks/forms';
import Finder from '~/client/components/Finder';

const InputArtworksField = ({ label, name, validate }) => {
  const [currentlySelectedArtwork, setCurrentlySelectedArtwork] = useState({});
  const [selectedArtworks, setSelectedArtworks] = useState([]);

  // Register form field
  const { meta, setValue, value } = useField(name, {
    validate,
    defaultValue: [],
  });

  // Bring initial field value into our internal state when component gets
  // mounted
  useEffect(() => {
    setSelectedArtworks(value);
  }, [value]);

  const onRemove = (artworkId) => {
    setValue(value.filter((artwork) => artwork.id !== artworkId));
    setSelectedArtworks(
      selectedArtworks.filter((artwork) => artwork.id !== artworkId),
    );
  };

  const onClickAdd = (event) => {
    event.preventDefault();
    setSelectedArtworks(selectedArtworks.concat([currentlySelectedArtwork]));
    setValue(value.concat([currentlySelectedArtwork]));
  };

  return (
    <InputFieldsetRounded label={label} meta={meta} name={name}>
      <InputArtworkFieldItems artworks={selectedArtworks} onRemove={onRemove} />

      <Finder
        label={translate('InputArtworksField.fieldArtwork')}
        name="artworkId"
        placeholder={translate('InputArtworksField.fieldArtworkPlaceholder')}
        queryPath={'artworks'}
        searchParam={'title'}
        setValue={setCurrentlySelectedArtwork}
      />
      <ButtonOutline disabled={false} onClick={onClickAdd}>
        {translate('InputArtworksField.fieldArtworkPrompt')}
      </ButtonOutline>
    </InputFieldsetRounded>
  );
};

const InputArtworkFieldItems = ({ artworks, onRemove }) => {
  return (
    <InputArtworkFieldItemsStyle>
      {artworks.map((artwork, index) => {
        const onClickRemove = () => {
          onRemove(artwork.id);
        };

        return (
          <InputArtworkFieldItemStyle key={index}>
            <InputArtworkFieldItemTextStyle>
              {artwork.title}
            </InputArtworkFieldItemTextStyle>

            <ButtonOutline disabled={!artwork.id} onClick={onClickRemove}>
              {translate('InputUploadField.buttonRemoveFile')}
            </ButtonOutline>
          </InputArtworkFieldItemStyle>
        );
      })}
    </InputArtworkFieldItemsStyle>
  );
};

const InputArtworkFieldItemsStyle = styled.ul`
  padding: 0;

  list-style: none;
`;

const InputArtworkFieldItemStyle = styled.li`
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

const InputArtworkFieldItemTextStyle = styled.span``;

InputArtworksField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

InputArtworkFieldItems.propTypes = {
  artworks: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default InputArtworksField;
