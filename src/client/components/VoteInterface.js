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
import { PaperContainerStyle, SpacingGroupStyle } from '~/client/styles/layout';
import {
  HeadingPrimaryStyle,
  HeadingSecondaryStyle,
} from '~/client/styles/typography';
import { getQuestion } from '~/common/services/contracts';
import { useResource } from '~/client/hooks/requests';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const FESTIVAL_STEP = 'festival';
const ARTWORK_STEP = 'artwork';

const VoteInterface = ({ festivalQuestionId, festivalAnswerIds }) => {
  const [currentStep, setCurrentStep] = useState(FESTIVAL_STEP);

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

  // Which answer of the first question had the most vote tokens?
  const [winnerArtworkId, setWinnerArtworkId] = useState(null);

  // Load question data for first festival question
  const [festivalQuestionData, isFestivalQuestionDataLoading] = useResource([
    'questions',
    festivalQuestionId,
  ]);

  // Prepare loading more data when we have the festival id ...
  const [data, isDataLoading] = useResource(
    festivalQuestionData && festivalQuestionData.festivalId
      ? ['festivals', festivalQuestionData.festivalId, 'questions']
      : [],
  );

  // ... load artwork data for second question from it as soon as we know the
  // winning artwork from the first question
  const artworkQuestionData = useMemo(() => {
    if (!data || !data.questions || !winnerArtworkId) {
      return {};
    }

    return data.questions.find((question) => {
      return question.artworkId === winnerArtworkId;
    });
  }, [winnerArtworkId, data]);

  useEffect(() => {
    if (!artworkQuestionData || !artworkQuestionData.answers) {
      return;
    }

    setCredits((value) => ({
      ...value,
      [ARTWORK_STEP]: artworkQuestionData.answers.reduce((acc, answer) => {
        acc[answer.id] = 0;
        return acc;
      }, {}),
    }));
  }, [artworkQuestionData]);

  // Is something loading here?
  const isLoading = isDataLoading || isFestivalQuestionDataLoading;

  // Get max vote tokens from chain
  useEffect(() => {
    const getMaxVoteTokens = async (stepName, chainId) => {
      const { maxVoteTokens } = await getQuestion(chainId);
      setCreditTotal((value) => ({
        ...value,
        [stepName]: maxVoteTokens,
      }));
      setCreditLeft((value) =>
        value[stepName] !== maxVoteTokens
          ? value
          : {
              ...value,
              [stepName]: maxVoteTokens,
            },
      );
    };

    if (festivalQuestionData.chainId) {
      getMaxVoteTokens(FESTIVAL_STEP, festivalQuestionData.chainId);
    }

    // Get data from artwork question (when festival question winner is set)
    if (artworkQuestionData.chainId && currentStep === ARTWORK_STEP) {
      getMaxVoteTokens(ARTWORK_STEP, artworkQuestionData.chainId);
    }
  }, [festivalQuestionData.chainId, artworkQuestionData.chainId, currentStep]);

  // Filter artwork for first question
  const artworks = useMemo(() => {
    if (!data || !data.questions) {
      return [];
    }

    const { answers } = data.questions.find((question) => {
      return question.id === festivalQuestionId;
    });

    return answers.reduce((acc, answer) => {
      if (answer.artwork && festivalAnswerIds.includes(answer.id)) {
        acc.push({
          ...answer.artwork,
          answerId: answer.id,
        });
      }

      return acc;
    }, []);
  }, [data, festivalQuestionId, festivalAnswerIds]);

  // Filter properties for second question
  const properties = useMemo(() => {
    if (!artworkQuestionData || !artworkQuestionData.answers) {
      return [];
    }

    return artworkQuestionData.answers.reduce((acc, answer) => {
      if (answer.property) {
        acc.push({
          ...answer.property,
          answerId: answer.id,
        });
      }

      return acc;
    }, []);
  }, [artworkQuestionData]);

  const onCreditChange = ({ stepName, id, credit }) => {
    const creditOld = credits[stepName][id];
    const creditNew = Math.min(credit, creditOld + creditLeft[stepName]);

    const creditsNew = Object.assign({}, credits[stepName], {
      [id]: creditNew,
    });
    setCredits((value) => ({
      ...value,
      [stepName]: creditsNew,
    }));

    const creditLeftNew = Object.keys(creditsNew).reduce((acc, creditId) => {
      return acc - creditsNew[creditId];
    }, creditTotal[stepName]);
    setCreditLeft((value) => ({
      ...value,
      [stepName]: creditLeftNew,
    }));

    const totalVotePower = Math.sqrt(creditTotal[stepName]);
    const currentVotePower = Math.sqrt(creditNew);
    setSnuggleness(currentVotePower / totalVotePower);

    // Set most voted artwork when in festival question step
    if (stepName === FESTIVAL_STEP) {
      const highestVoteTokens = Math.max(...Object.values(creditsNew));
      setWinnerArtworkId(
        highestVoteTokens > 0
          ? parseInt(
              Object.keys(creditsNew).find((id) => {
                return creditsNew[id] === highestVoteTokens;
              }),
              10,
            )
          : null,
      );
    }
  };

  const onNextStep = () => {
    setCurrentStep(ARTWORK_STEP);
  };

  const onPreviousStep = () => {
    setCurrentStep(FESTIVAL_STEP);
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
                    {translate('VoteInterface.buttonNextStep')}
                  </ButtonIcon>
                </PaperTicket>
              </PaperContainerStyle>
            </Fragment>
          ) : (
            <Fragment>
              <VoteCreditsBar
                left={creditLeft[ARTWORK_STEP]}
                total={creditTotal[ARTWORK_STEP]}
              />

              <PaperContainerStyle>
                <PaperTicket>
                  <BoxFramed>
                    <HeadingPrimaryStyle>
                      {artworkQuestionData.title}
                    </HeadingPrimaryStyle>
                  </BoxFramed>
                </PaperTicket>

                {properties.map((property) => {
                  return (
                    <VoteInterfaceProperty
                      answerId={property.answerId}
                      credit={credits[ARTWORK_STEP][property.answerId]}
                      creditTotal={creditTotal[ARTWORK_STEP]}
                      key={property.id}
                      title={property.title}
                      onCreditChange={onCreditChange}
                    />
                  );
                })}

                <PaperTicket>
                  <SpacingGroupStyle>
                    <ButtonIcon isIconFlipped onClick={onPreviousStep}>
                      {translate('VoteInterface.buttonPreviousStep')}
                    </ButtonIcon>

                    <ButtonIcon onClick={onVote}>
                      {translate('VoteInterface.buttonVote')}
                    </ButtonIcon>
                  </SpacingGroupStyle>
                </PaperTicket>
              </PaperContainerStyle>
            </Fragment>
          )}
        </ColorSection>
      )}
    </Fragment>
  );
};

const VoteInterfaceArtwork = (props) => {
  const stickerImagePath = useStickerImage(props.images);
  const { scheme } = useSticker(props.stickerCode);

  const onCreditChange = ({ id, credit }) => {
    props.onCreditChange({
      id,
      credit,
      stepName: FESTIVAL_STEP,
    });
  };

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
          onChange={onCreditChange}
        />
      </PaperTicket>
    </Suspense>
  );
};

const VoteInterfaceProperty = (props) => {
  const onCreditChange = ({ id, credit }) => {
    props.onCreditChange({
      id,
      credit,
      stepName: ARTWORK_STEP,
    });
  };

  return (
    <PaperTicket>
      <HeadingSecondaryStyle>{props.title}</HeadingSecondaryStyle>

      <SnuggleSlider
        credit={props.credit}
        id={props.answerId}
        total={props.creditTotal}
        onChange={onCreditChange}
      />
    </PaperTicket>
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

VoteInterfaceProperty.propTypes = {
  answerId: PropTypes.number.isRequired,
  credit: PropTypes.number.isRequired,
  creditTotal: PropTypes.number.isRequired,
  onCreditChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default VoteInterface;
