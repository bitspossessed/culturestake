import PropTypes from 'prop-types';
import React, { Fragment, Suspense, useEffect, useState, useMemo } from 'react';

import BoxFramed from '~/client/components/BoxFramed';
import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import Loading from '~/client/components/Loading';
import PaperTicket from '~/client/components/PaperTicket';
import SnuggleRain from '~/client/components/SnuggleRain';
import SnuggleSlider from '~/client/components/SnuggleSlider';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import VoteCreditsBar from '~/client/components/VoteCreditsBar';
import translate from '~/common/services/i18n';
import { ContainerStyle, PaperContainerStyle } from '~/client/styles/layout';
import { HeadingPrimaryStyle } from '~/client/styles/typography';
import { getQuestion } from '~/common/services/contracts';
import { useResource } from '~/client/hooks/resources';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const FESTIVAL_STEP = 'festival';
const ARTWORK_STEP = 'artwork';

const VoteInterface = ({ festivalQuestionId, festivalAnswerIds }) => {
  const [currentStep, setCurrentStep] = useState(FESTIVAL_STEP);
  const [isChainDataLoading, setIsChainDataLoading] = useState(false);

  // How happy is our SnuggleRain component?
  const [snuggleness, setSnuggleness] = useState(0.0);

  // Actual quadratic vote states, divided by the two separate votes
  const [creditLeft, setCreditLeft] = useState({
    [FESTIVAL_STEP]: 0,
    [ARTWORK_STEP]: 0,
  });
  const [creditTotal, setCreditTotal] = useState({
    [FESTIVAL_STEP]: 0,
    [ARTWORK_STEP]: 0,
  });
  const [credits, setCredits] = useState({
    [FESTIVAL_STEP]: festivalAnswerIds.reduce((acc, id) => {
      acc[id] = 0;
      return acc;
    }, {}),
    [ARTWORK_STEP]: {},
  });

  const [winnerArtworkId, setWinnerArtworkId] = useState(null);
  const [artworkQuestionId, setArtworkQuestionId] = useState(
    festivalQuestionId,
  );

  // Load question and answer data for both questions
  const [festivalQuestionData, isFestivalQuestionLoading] = useResource([
    'questions',
    festivalQuestionId,
  ]);

  const [artworkQuestionData, isArtworkQuestionLoading] = useResource([
    'questions',
    artworkQuestionId,
  ]);

  // Is something loading here?
  const isLoading =
    isFestivalQuestionLoading || isArtworkQuestionLoading || isChainDataLoading;

  // Get max vote tokens from chain
  useEffect(() => {
    const getMaxVoteTokens = async (stepName, chainId) => {
      setIsChainDataLoading(true);

      const { maxVoteTokens } = await getQuestion(chainId);
      setCreditTotal((value) => ({
        ...value,
        [stepName]: parseInt(maxVoteTokens, 10),
      }));

      setIsChainDataLoading(false);
    };

    if (festivalQuestionData.chainId) {
      getMaxVoteTokens(FESTIVAL_STEP, festivalQuestionData.chainId);
    }

    if (artworkQuestionData.chainId) {
      getMaxVoteTokens(ARTWORK_STEP, artworkQuestionData.chainId);
    }
  }, [festivalQuestionData, artworkQuestionData]);

  // Filter artwork for first question
  const artworks = useMemo(() => {
    if (isFestivalQuestionLoading || !festivalQuestionData.answers) {
      return [];
    }

    return festivalQuestionData.answers.reduce((acc, answer) => {
      if (answer.artwork && festivalAnswerIds.includes(answer.id)) {
        acc.push({
          ...answer.artwork,
          answerId: answer.id,
        });
      }

      return acc;
    }, []);
  }, [festivalAnswerIds, isFestivalQuestionLoading, festivalQuestionData]);

  // Filter properties for second question
  const properties = useMemo(() => {
    if (
      isArtworkQuestionLoading ||
      !artworkQuestionData.answers ||
      !winnerArtworkId
    ) {
      return [];
    }

    // @TODO
    // return artworkQuestionData.answers.reduce((acc, answer) => {
    //   if (answer.property) {
    //     acc.push({
    //       ...answer.artwork,
    //       answerId: answer.id,
    //     });
    //   }

    //   return acc;
    // }, []);
    return [];
  }, [winnerArtworkId, isArtworkQuestionLoading, artworkQuestionData]);

  const onCreditChange = ({ id, credit }) => {
    const creditOld = credits[id];
    const creditNew = Math.min(credit, creditOld + creditLeft);

    const creditsNew = Object.assign({}, credits, {
      [id]: creditNew,
    });
    setCredits(creditsNew);

    const creditsLeftNew = Object.keys(creditsNew).reduce((acc, creditId) => {
      return acc - creditsNew[creditId];
    }, creditTotal);
    setCreditLeft(creditsLeftNew);

    const totalVotePower = Math.sqrt(creditTotal);
    const currentVotePower = Math.sqrt(creditNew);
    setSnuggleness(currentVotePower / totalVotePower);
  };

  const onNextStep = () => {
    setCurrentStep(ARTWORK_STEP);
  };

  const onVote = () => {
    // @TODO
  };

  return (
    <Fragment>
      <SnuggleRain snuggleness={snuggleness} />

      {isLoading ? (
        <Loading />
      ) : (
        <ColorSection>
          {currentStep === FESTIVAL_STEP ? (
            <Fragment>
              <VoteCreditsBar
                left={creditLeft[FESTIVAL_STEP]}
                total={creditTotal[FESTIVAL_STEP]}
              />

              <PaperContainerStyle>
                <PaperTicket>
                  <BoxFramed>
                    <HeadingPrimaryStyle>
                      {festivalQuestionData.title}
                    </HeadingPrimaryStyle>
                  </BoxFramed>
                </PaperTicket>

                {artworks.map((artwork) => {
                  return (
                    <VoteInterfaceArtwork
                      answerId={artwork.answerId}
                      credit={credits[FESTIVAL_STEP][artwork.answerId]}
                      creditTotal={creditTotal[FESTIVAL_STEP]}
                      images={artwork.images}
                      key={artwork.id}
                      stickerCode={artwork.sticker}
                      subtitle={artwork.subtitle}
                      title={artwork.title}
                      onCreditChange={onCreditChange}
                    />
                  );
                })}

                <PaperTicket>
                  <ButtonIcon disabled={!winnerArtworkId} onClick={onNextStep}>
                    {translate('Vote.buttonNextStep')}
                  </ButtonIcon>
                </PaperTicket>
              </PaperContainerStyle>
            </Fragment>
          ) : (
            <PaperContainerStyle>{/* @TODO */}</PaperContainerStyle>
          )}
        </ColorSection>
      )}
    </Fragment>
  );
};

const VoteInterfaceArtwork = (props) => {
  const stickerImagePath = useStickerImage(props.images);
  const { scheme } = useSticker(props.stickerCode);

  return (
    <Suspense fallback={null}>
      <PaperTicket scheme={scheme}>
        <Sticker code={props.stickerCode} imagePath={stickerImagePath} />

        <StickerHeading
          scheme={scheme}
          subtitle={props.subtitle}
          title={props.title}
        />

        <SnuggleSlider
          credit={props.credit}
          id={props.answerId}
          scheme={scheme}
          total={props.creditTotal}
          onChange={props.onCreditChange}
        />
      </PaperTicket>
    </Suspense>
  );
};

VoteInterface.propTypes = {
  festivalAnswerIds: PropTypes.array.isRequired,
  festivalQuestionId: PropTypes.number.isRequired,
};

VoteInterfaceArtwork.propTypes = {
  answerId: PropTypes.number.isRequired,
  credit: PropTypes.number.isRequired,
  creditTotal: PropTypes.number.isRequired,
  images: PropTypes.array,
  onCreditChange: PropTypes.func.isRequired,
  stickerCode: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default VoteInterface;
