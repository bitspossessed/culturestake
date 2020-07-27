import PropTypes from 'prop-types';
import React, { Fragment, useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import BoxRounded from '~/client/components/BoxRounded';
import ButtonOutline from '~/client/components/ButtonOutline';
import ColorSection from '~/client/components/ColorSection';
import PaperStamp from '~/client/components/PaperStamp';
import Pill from '~/client/components/Pill';
import QRCode from '~/client/components/QRCode';
import Scanner from '~/client/components/Scanner';
import Spinner from '~/client/components/Spinner';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { PaperContainerStyle } from '~/client/styles/layout';
import { ParagraphStyle } from '~/client/styles/typography';
import {
  encodeVoteData,
  getBoothNonce,
  signBooth,
} from '~/common/services/vote';
import { useResource } from '~/client/hooks/resources';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const ADMIN_KEY = 77; // Key [M] (+ [SHIFT])

const VoteSessionCreator = () => {
  const booth = useSelector((state) => state.booth);

  const [festivalAnswerIds, setFestivalAnswerIds] = useState([]);
  const [festivalQuestionId, setFestivalQuestionId] = useState(null);
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [voteData, setVoteData] = useState(null);

  const [data, isArtworksLoading] = useResource([
    'booths',
    booth.festivalChainId,
  ]);

  const artworks = useMemo(() => {
    if (!isLoading) {
      return [];
    }

    let questionId;

    const result = data.questions.reduce((acc, question) => {
      // Combine answerId with artwork
      question.answers.forEach((answer) => {
        if (answer.artwork) {
          acc.push({
            ...answer.artwork,
            answerId: answer.id,
          });

          // Extract questionId related to all of these
          // answers + make sure it stays the same
          if (questionId && questionId !== answer.questionId) {
            throw new Error('Only one question per vote');
          }

          questionId = answer.questionId;
        }
      });

      return acc;
    }, []);

    setFestivalQuestionId(questionId);

    return result;
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

  const onCreateVoteSession = async () => {
    setIsLoading(true);

    const nonce = await getBoothNonce();

    const signature = signBooth({
      festivalAnswerIds,
      privateKey: '',
      nonce,
    });

    setVoteData(
      encodeVoteData({
        festivalAnswerIds,
        festivalQuestionId,
        nonce,
        signature,
      }),
    );

    setIsLoading(false);
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

      {isLoading || isArtworksLoading ? (
        <Spinner isLarge />
      ) : (
        <ColorSection>
          {voteData ? (
            <Fragment>
              <QRCode data={voteData} />

              <ButtonOutline to={`/vote/${voteData}`}>
                {translate('VoteSessionCreator.buttonVoteOnBooth')}
              </ButtonOutline>
            </Fragment>
          ) : (
            <Fragment>
              {!isManual && (
                <VoteSessionCreatorScannerStyle>
                  <Scanner onDetected={onBarcodeScanned} />
                </VoteSessionCreatorScannerStyle>
              )}

              <PaperContainerStyle>
                {artworks.map((artwork) => {
                  return (
                    <VoteSessionCreatorArtwork
                      answerId={artwork.answerId}
                      artistName={artwork.artist.name}
                      images={artwork.images}
                      isSelected={festivalAnswerIds.includes(artwork.answerId)}
                      key={artwork.id}
                      stickerCode={artwork.sticker}
                      title={artwork.title}
                      onToggle={onManualToggle}
                    />
                  );
                })}
              </PaperContainerStyle>
            </Fragment>
          )}
        </ColorSection>
      )}
    </VoteSessionCreatorStyle>
  );
};

const VoteSessionCreatorArtwork = (props) => {
  const stickerImagePath = useStickerImage(props.images);
  const { scheme } = useSticker(props.stickerCode);

  const onToggle = () => {
    props.onToggle(props.answerId);
  };

  return (
    <PaperStamp
      isDisabled={!props.isSelected}
      scheme={scheme}
      onClick={onToggle}
    >
      <Sticker code={props.stickerCode} imagePath={stickerImagePath} />

      <StickerHeading
        scheme={scheme}
        subtitle={props.artistName}
        title={props.title}
      />
    </PaperStamp>
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

VoteSessionCreatorArtwork.propTypes = {
  answerId: PropTypes.number.isRequired,
  artistName: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  stickerCode: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default VoteSessionCreator;
