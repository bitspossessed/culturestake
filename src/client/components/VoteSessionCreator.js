import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

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
  const dispatch = useDispatch();
  const booth = useSelector((state) => state.booth);

  const [festivalAnswerIds, setFestivalAnswerIds] = useState([]);
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [isManual, setIsManual] = useState(false);

  const [artworks, isLoading] = useResource(['booths', booth.festivalAddress], {
    isCollection: true,
  });

  const onBarcodeScanned = (barcode) => {
    // @TODO: Resolve and add answer id
    // const answerId = ...
    // setFestivalAnswerIds(festivalAnswerIds.concat([answerId]));
  };

  const onManualOverride = () => {
    setIsManual(true);
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
              {translate('VoteSessionCreator.bodyFestivalAddress')}{' '}
              <Pill>{booth.festivalAddress}</Pill>
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
              // @TODO
              return <div key={artwork.id} />;
            })}
          </VoteSessionCreatorArtworksStyle>
        </Fragment>
      )}
    </VoteSessionCreatorStyle>
  );
};

const VoteSessionCreatorStyle = styled.div``;

const VoteSessionCreatorAdminStyle = styled.div`
  position: fixed;

  top: ${styles.layout.spacing};
  right: ${styles.layout.spacing};

  width: 30rem;

  z-index: ${styles.layers.VoteSessionCreatorAdmin};
`;

const VoteSessionCreatorScannerStyle = styled.div`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.layers.VoteSessionCreatorScanner};

  display: flex;

  justify-content: center;
  align-items: center;

  background-color: rgba(255, 255, 255, 0.3);
`;

const VoteSessionCreatorArtworksStyle = styled.div``;

export default VoteSessionCreator;
