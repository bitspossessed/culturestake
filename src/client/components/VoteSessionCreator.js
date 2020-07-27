import PropTypes from 'prop-types';
import React, { Fragment, useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import BoxRounded from '~/client/components/BoxRounded';
import ButtonOutline from '~/client/components/ButtonOutline';
import Pill from '~/client/components/Pill';
import Scanner from '~/client/components/Scanner';
import Spinner from '~/client/components/Spinner';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { ParagraphStyle } from '~/client/styles/typography';
import { useResource } from '~/client/hooks/resources';

const ADMIN_KEY = 77; // Key [M] (+ [SHIFT])

const VoteSessionCreator = () => {
  const booth = useSelector((state) => state.booth);

  const [festivalAnswerIds, setFestivalAnswerIds] = useState([]);
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [isManual, setIsManual] = useState(false);

  const [data, isLoading] = useResource(['booths', booth.festivalChainId]);

  const artworks = useMemo(() => {
    if (!isLoading) {
      return [];
    }

    return data.questions.reduce((acc, question) => {
      // Combine answerId with artwork
      question.answers.forEach((answer) => {
        if (answer.artwork) {
          acc.push({
            ...answer.artwork,
            answerId: answer.id,
          });
        }
      });

      return acc;
    }, []);
  }, [isLoading, data]);

  const onBarcodeScanned = (barcode) => {
    const { answerId } = artworks.find((artwork) => {
      return artwork.barcode === barcode;
    });

    // Connected answer was not found / Barcode was invalid
    if (!answerId) {
      return;
    }

    // Barcode was already scanned
    if (festivalAnswerIds.includes(answerId)) {
      return;
    }

    setFestivalAnswerIds(festivalAnswerIds.concat([answerId]));
  };

  const onManualOverride = () => {
    setIsManual(true);
  };

  const onManualToggle = (answerId) => {
    if (!isManual) {
      return;
    }

    if (festivalAnswerIds.includes(answerId)) {
      setFestivalAnswerIds(festivalAnswerIds.filter((id) => id !== answerId));
    } else {
      setFestivalAnswerIds(festivalAnswerIds.concat([answerId]));
    }
  };

  const onCreateVoteSession = () => {
    // @TODO: Build vote signature
    // dispatch(...);
  };

  useEffect(() => {
    const onKeyDown = window.addEventListener('keydown', (event) => {
      if (event.keyCode === ADMIN_KEY && event.shiftKey) {
        setIsAdminVisible(!isAdminVisible);
      }
    });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isAdminVisible, setIsAdminVisible]);

  return (
    <VoteSessionCreatorStyle>
      {isAdminVisible && (
        <VoteSessionCreatorAdminStyle>
          <BoxRounded title={translate('VoteSessionCreator.bodyAdmin')}>
            <ParagraphStyle>
              {translate('VoteSessionCreator.bodyBoothAddress')}{' '}
              <Pill>{booth.address}</Pill>
            </ParagraphStyle>

            <ParagraphStyle>
              {translate('VoteSessionCreator.bodyFestivalChainId')}{' '}
              <Pill>{booth.festivalChainId}</Pill>
            </ParagraphStyle>

            <ButtonOutline disabled={isManual} onClick={onManualOverride}>
              {translate('VoteSessionCreator.buttonManualOverride')}
            </ButtonOutline>

            <ButtonOutline
              disabled={festivalAnswerIds.length === 0}
              onClick={onCreateVoteSession}
            >
              {translate('VoteSessionCreator.buttonCreateVoteSession')}
            </ButtonOutline>
          </BoxRounded>
        </VoteSessionCreatorAdminStyle>
      )}

      {isLoading ? (
        <Spinner isLarge />
      ) : (
        <Fragment>
          {!isManual && (
            <VoteSessionCreatorScannerStyle>
              <Scanner onDetected={onBarcodeScanned} />
            </VoteSessionCreatorScannerStyle>
          )}

          <VoteSessionCreatorArtworksStyle>
            {artworks.map((artwork) => {
              return (
                <VoteSessionCreatorArtwork
                  answerId={artwork.answerId}
                  artistName={artwork.artist.name}
                  isSelected={festivalAnswerIds.includes(artwork.answerId)}
                  key={artwork.id}
                  title={artwork.title}
                  onToggle={onManualToggle}
                />
              );
            })}
          </VoteSessionCreatorArtworksStyle>
        </Fragment>
      )}
    </VoteSessionCreatorStyle>
  );
};

const VoteSessionCreatorArtwork = (props) => {
  const onToggle = () => {
    props.onToggle(props.answerId);
  };

  return (
    <VoteSessionCreatorArtworkItemStyle
      isSelected={props.isSelected}
      onClick={onToggle}
    >
      {props.title}
      {props.artistName}
    </VoteSessionCreatorArtworkItemStyle>
  );
};

const VoteSessionCreatorStyle = styled.div``;

const VoteSessionCreatorAdminStyle = styled.div`
  position: fixed;

  top: ${styles.layout.spacing};
  right: ${styles.layout.spacing};

  z-index: ${styles.layers.VoteSessionCreatorAdmin};

  width: 30rem;
`;

const VoteSessionCreatorScannerStyle = styled.div`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.layers.VoteSessionCreatorScanner};

  display: flex;

  background-color: rgba(255, 255, 255, 0.3);

  align-items: center;
  justify-content: center;
`;

const VoteSessionCreatorArtworksStyle = styled.ul``;

const VoteSessionCreatorArtworkItemStyle = styled.li``;

VoteSessionCreatorArtwork.propTypes = {
  answerId: PropTypes.number.isRequired,
  artistName: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default VoteSessionCreator;
