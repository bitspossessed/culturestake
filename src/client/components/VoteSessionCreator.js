import PropTypes from 'prop-types';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import BoxRounded from '~/client/components/BoxRounded';
import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import HorizontalLine from '~/client/components/HorizontalLine';
import Loading from '~/client/components/Loading';
import PaperStamp from '~/client/components/PaperStamp';
import Pill from '~/client/components/Pill';
import QRCode from '~/client/components/QRCode';
import Scanner from '~/client/components/Scanner';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import styles from '~/client/styles/variables';
import swirl from '~/client/assets/images/swirl.svg';
import translate from '~/common/services/i18n';
import {
  ContainerStyle,
  PaperContainerStyle,
  SpacingGroupStyle,
} from '~/client/styles/layout';
import { BOOTH_ACCOUNT_NAME } from '~/client/store/booth/actions';
import { ParagraphStyle } from '~/client/styles/typography';
import {
  decodeVoteData,
  encodeVoteData,
  signBooth,
} from '~/common/services/vote';
import { getPrivateKey } from '~/client/services/wallet';
import { initializeVote } from '~/client/store/vote/actions';
import { useResource } from '~/client/hooks/requests';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const ADMIN_KEY = 77; // Key [M] (+ [SHIFT])

const VoteSessionCreator = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { address, festivalChainId, nonce } = useSelector(
    (state) => state.booth,
  );

  const [festivalAnswerIds, setFestivalAnswerIds] = useState([]);
  const [festivalQuestionId, setFestivalQuestionId] = useState(null);
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [voteData, setVoteData] = useState(null);

  const barcodes = useRef({});
  const [data, isArtworksLoading] = useResource([
    'festivals',
    festivalChainId,
    'questions',
  ]);

  const artworks = useMemo(() => {
    if (isLoading || !data.questions) {
      return [];
    }

    try {
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

      barcodes.current = result.reduce((acc, artwork) => {
        acc[artwork.barcode] = artwork;
        return acc;
      }, {});

      return result;
    } catch {
      dispatch(
        notify({
          text: translate('VoteSessionCreator.notificationInvalidData'),
          type: NotificationsTypes.ERROR,
        }),
      );

      return [];
    }
  }, [dispatch, isLoading, data]);

  const onBarcodeScanned = useCallback(
    (barcode) => {
      // Connected answer was not found / Barcode was invalid
      if (!(barcode in barcodes.current)) {
        return;
      }

      const { answerId, title } = barcodes.current[barcode];

      // Activate it!
      setFestivalAnswerIds((answerIds) => {
        // Barcode was already scanned
        if (answerIds.includes(answerId)) {
          return answerIds;
        }

        dispatch(
          notify({
            text: translate('VoteSessionCreator.notificationAddedArtwork', {
              title,
            }),
          }),
        );

        return answerIds.concat([answerId]);
      });
    },
    [dispatch, barcodes],
  );

  const onManualOverride = () => {
    setIsManual(true);
    setIsAdminVisible(false);
  };

  const onManualToggle = useCallback(
    (answerId) => {
      if (!isManual) {
        return;
      }

      if (festivalAnswerIds.includes(answerId)) {
        setFestivalAnswerIds(festivalAnswerIds.filter((id) => id !== answerId));
      } else {
        setFestivalAnswerIds(festivalAnswerIds.concat([answerId]));
      }
    },
    [isManual, festivalAnswerIds],
  );

  const onCreateVoteSession = useCallback(async () => {
    setIsLoading(true);
    setIsAdminVisible(false);

    const boothSignature = signBooth({
      festivalAnswerIds,
      privateKey: getPrivateKey(BOOTH_ACCOUNT_NAME),
      nonce,
    });

    setVoteData(
      encodeVoteData({
        boothSignature,
        festivalAnswerIds,
        festivalQuestionId,
        nonce,
      }),
    );

    setIsLoading(false);
  }, [nonce, festivalAnswerIds, festivalQuestionId]);

  const onVoteOnBooth = async () => {
    setIsLoading(true);

    // Put vote data in store
    dispatch(initializeVote(decodeVoteData(voteData)));

    // Reset voting booth
    onReset();

    // Show spinner (because its fun!)
    await new Promise((resolve) => window.setTimeout(resolve, 500));

    // Redirect to vote page
    history.push('/vote');
  };

  const onReset = () => {
    setVoteData(null);
    setFestivalAnswerIds([]);
  };

  useEffect(() => {
    const onKeyDown = window.addEventListener('keydown', (event) => {
      if (event.keyCode === ADMIN_KEY && event.shiftKey) {
        setIsAdminVisible((isVisible) => !isVisible);
      }
    });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [setIsAdminVisible]);

  const isVoteCreated = !!voteData;

  return (
    <Fragment>
      {isAdminVisible && (
        <VoteSessionCreatorAdminStyle>
          <BoxRounded title={translate('VoteSessionCreator.titleAdmin')}>
            <ParagraphStyle>
              {translate('VoteSessionCreator.bodyBoothAddress')}{' '}
              <Pill>{address}</Pill>
            </ParagraphStyle>

            <ParagraphStyle>
              {translate('VoteSessionCreator.bodyFestivalChainId')}{' '}
              <Pill>{festivalChainId}</Pill>
            </ParagraphStyle>

            <HorizontalLine />

            <ParagraphStyle>
              {translate('VoteSessionCreator.bodySelectedArtworks', {
                count: festivalAnswerIds.length,
              })}
            </ParagraphStyle>

            <SpacingGroupStyle>
              <ButtonIcon
                disabled={isManual}
                url={swirl}
                onClick={onManualOverride}
              >
                {translate('VoteSessionCreator.buttonManualOverride')}
              </ButtonIcon>

              <ButtonIcon
                disabled={festivalAnswerIds.length === 0 || isVoteCreated}
                onClick={onCreateVoteSession}
              >
                {translate('VoteSessionCreator.buttonCreateVoteSession')}
              </ButtonIcon>
            </SpacingGroupStyle>
          </BoxRounded>
        </VoteSessionCreatorAdminStyle>
      )}

      {!isManual && !isVoteCreated && (
        <Scanner onDetected={onBarcodeScanned} onError={onManualOverride} />
      )}

      {isLoading || isArtworksLoading ? (
        <Loading />
      ) : (
        <ColorSection>
          {isVoteCreated ? (
            <ContainerStyle>
              <BoxRounded
                title={translate('VoteSessionCreator.titleStartVote')}
              >
                <QRCode data={voteData} />

                <SpacingGroupStyle>
                  <ButtonIcon onClick={onVoteOnBooth}>
                    {translate('VoteSessionCreator.buttonVoteOnBooth')}
                  </ButtonIcon>

                  <ButtonIcon url={swirl} onClick={onReset}>
                    {translate('VoteSessionCreator.buttonReset')}
                  </ButtonIcon>
                </SpacingGroupStyle>
              </BoxRounded>
            </ContainerStyle>
          ) : (
            <PaperContainerStyle>
              {artworks.map((artwork) => {
                return (
                  <VoteSessionCreatorArtwork
                    answerId={artwork.answerId}
                    images={artwork.images}
                    isSelected={festivalAnswerIds.includes(artwork.answerId)}
                    key={artwork.id}
                    stickerCode={artwork.sticker}
                    subtitle={artwork.subtitle}
                    title={artwork.title}
                    onToggle={onManualToggle}
                  />
                );
              })}
            </PaperContainerStyle>
          )}
        </ColorSection>
      )}
    </Fragment>
  );
};

const VoteSessionCreatorArtwork = (props) => {
  const stickerImagePath = useStickerImage(props.images);
  const { scheme } = useSticker(props.stickerCode);

  const onToggle = () => {
    props.onToggle(props.answerId);
  };

  return (
    <VoteSessionCreatorArtworkStyle onClick={onToggle}>
      <PaperStamp isDisabled={!props.isSelected} scheme={scheme}>
        <Sticker code={props.stickerCode} imagePath={stickerImagePath} />

        <StickerHeading
          scheme={scheme}
          subtitle={props.subtitle}
          title={props.title}
        />
      </PaperStamp>
    </VoteSessionCreatorArtworkStyle>
  );
};

const VoteSessionCreatorAdminStyle = styled.div`
  position: fixed;

  top: ${styles.layout.spacing};
  right: ${styles.layout.spacing};

  z-index: ${styles.layers.VoteSessionCreatorAdmin};

  width: 30rem;
`;

const VoteSessionCreatorArtworkStyle = styled.div`
  cursor: pointer;
`;

VoteSessionCreatorArtwork.propTypes = {
  answerId: PropTypes.number.isRequired,
  images: PropTypes.array,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  stickerCode: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default VoteSessionCreator;
