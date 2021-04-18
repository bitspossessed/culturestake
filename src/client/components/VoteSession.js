import PropTypes from 'prop-types';
import React, { Fragment, Suspense, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import BoxFramed from '~/client/components/BoxFramed';
import ButtonGroup from '~/client/components/ButtonGroup';
import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import HorizontalLine from '~/client/components/HorizontalLine';
import Legend from '~/client/components/Legend';
import Loading from '~/client/components/Loading';
import PaperTicket from '~/client/components/PaperTicket';
import SnuggleRain from '~/client/components/SnuggleRain';
import SnuggleSlider from '~/client/components/SnuggleSlider';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import ThreeCanvas from '~/client/components/ThreeCanvas';
import ThreeRotator from '~/client/components/ThreeRotator';
import ThreeThankYou from '~/client/components/ThreeThankYou';
import VoteCreditsBar from '~/client/components/VoteCreditsBar';
import { MAX_VOTE_TOKENS } from '~/common/utils/constants';
import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';
import translate from '~/common/services/i18n';
import web3 from '~/common/services/web3';
import {
  HeadingPrimaryStyle,
  HeadingSecondaryStyle,
  ParagraphStyle,
} from '~/client/styles/typography';
import {
  HorizontalSpacingStyle,
  PaperContainerStyle,
  SpacingGroupStyle,
} from '~/client/styles/layout';
import { VOTE_ACCOUNT_NAME } from '~/client/store/vote/actions';
import { getPrivateKey } from '~/client/services/wallet';
import { packBooth } from '~/common/services/encoding';
import { signAudienceVote } from '~/common/services/vote';
import { useResource, useRequest, useRequestId } from '~/client/hooks/requests';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';
import { vote } from '~/client/store/vote/actions';

const MAX_TOP_ARTWORKS = 3;
const STEP_FESTIVAL = 'festival';
const STEP_ARTWORK = 'artwork';

const VoteSession = ({
  boothSignature,
  festivalAnswerIds,
  festivalQuestionId,
  nonce,
  senderAddress,
  organisationId = null,
  voteCallback,
}) => {
  const dispatch = useDispatch();
  const { isAlternateColor } = useSelector((state) => state.app);

  const [currentStep, setCurrentStep] = useState(STEP_FESTIVAL);
  const [isVoting, setIsVoting] = useState(false);

  // How happy is our SnuggleRain component?
  const [snuggleness, setSnuggleness] = useState(0.0);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Actual quadratic vote states, divided by the two separate vote steps
  const [creditLeft, setCreditLeft] = useState({
    [STEP_FESTIVAL]: -1,
    [STEP_ARTWORK]: -1,
  });
  const [creditTotal, setCreditTotal] = useState({
    [STEP_FESTIVAL]: 0,
    [STEP_ARTWORK]: 0,
  });
  const [credits, setCredits] = useState({
    [STEP_FESTIVAL]: festivalAnswerIds.reduce((acc, id) => {
      acc[id] = 0;
      return acc;
    }, {}),
    [STEP_ARTWORK]: {},
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
    function showPosition(position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    }
    function getLocation() {
      if (navigator.geolocation && data && data.online) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }
    }
    getLocation();
  });

  useEffect(() => {
    if (!artworkQuestionData || !artworkQuestionData.answers) {
      return;
    }

    setCredits((value) => ({
      ...value,
      [STEP_ARTWORK]: artworkQuestionData.answers.reduce((acc, answer) => {
        acc[answer.id] = 0;
        return acc;
      }, {}),
    }));
  }, [artworkQuestionData]);

  const hasVotedOnArtworks = !!Object.keys(credits[STEP_ARTWORK]).find(
    (answerId) => credits[STEP_ARTWORK][answerId] > 0,
  );

  // Current status of vote request
  const requestId = useRequestId();
  const { isSuccess: isVoteSuccess } = useRequest(requestId, {
    onSuccess: () => {
      setIsVoting(false);
    },
    onError: () => {
      setIsVoting(false);

      dispatch(
        notify({
          text: translate('VoteSession.errorVoteFailure'),
          type: NotificationsTypes.ERROR,
        }),
      );
    },
  });

  // Is something loading here?
  const isLoading = isDataLoading || isFestivalQuestionDataLoading || isVoting;

  // Get max vote tokens
  // If we ever open up customization of the vote tokens quantity, this will need to be fetched
  // from the chain or the graph, but for now, it is a constant
  useEffect(() => {
    const getMaxVoteTokens = async (stepName) => {
      const maxVoteTokens = MAX_VOTE_TOKENS;
      setCreditTotal((value) => ({
        ...value,
        [stepName]: maxVoteTokens,
      }));
      setCreditLeft((value) =>
        value[stepName] !== -1
          ? value
          : {
              ...value,
              [stepName]: maxVoteTokens,
            },
      );
    };

    if (festivalQuestionData.chainId) {
      getMaxVoteTokens(STEP_FESTIVAL, festivalQuestionData.chainId);
    }

    // Get data from artwork question (when festival question winner is set)
    if (artworkQuestionData.chainId && currentStep === STEP_ARTWORK) {
      getMaxVoteTokens(STEP_ARTWORK, artworkQuestionData.chainId);
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

    return answers
      .sort(({ id: itemA }, { id: itemB }) => {
        // Sort by id to be consisent with the order of things
        return itemA - itemB;
      })
      .reduce((acc, answer) => {
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

    return artworkQuestionData.answers
      .reduce((acc, answer) => {
        if (answer.property) {
          acc.push({
            ...answer.property,
            answerId: answer.id,
          });
        }

        return acc;
      }, [])
      .sort(({ id: itemA }, { id: itemB }) => {
        // Sort by id to be consisent with the order of things
        return itemA - itemB;
      });
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
    if (stepName === STEP_FESTIVAL) {
      const highestVoteTokens = Math.max(...Object.values(creditsNew));
      const winnerAnswerId =
        highestVoteTokens > 0
          ? parseInt(
              Object.keys(creditsNew).find((id) => {
                return creditsNew[id] === highestVoteTokens;
              }),
              10,
            )
          : null;

      if (!winnerAnswerId) {
        setWinnerArtworkId(null);
      } else {
        const { artworkId } = festivalQuestionData.answers.find(
          ({ id }) => id === winnerAnswerId,
        );

        setWinnerArtworkId(artworkId);
      }
    }
  };

  const highestVoteArtworks = useMemo(() => {
    return artworks
      .map((artwork) => {
        artwork.voteTokens = credits[STEP_FESTIVAL][artwork.answerId];
        return artwork;
      })
      .sort(({ voteTokens: itemA }, { voteTokens: itemB }) => {
        return itemB - itemA;
      })
      .slice(0, MAX_TOP_ARTWORKS);
  }, [artworks, credits]);

  const onNextStep = () => {
    setCurrentStep(STEP_ARTWORK);
  };

  const onPreviousStep = () => {
    setCurrentStep(STEP_FESTIVAL);
  };

  const onVote = async () => {
    const festivalVoteTokens = Object.values(credits[STEP_FESTIVAL]);

    const artworkQuestionId = artworkQuestionData.id;
    const artworkVoteTokens = Object.values(credits[STEP_ARTWORK]);
    const artworkAnswerIds = Object.keys(credits[STEP_ARTWORK]).map((id) =>
      parseInt(id, 10),
    );

    const boothAddress = web3.eth.accounts.recover(
      packBooth(festivalAnswerIds, nonce),
      boothSignature,
    );

    const senderSignature = signAudienceVote({
      festivalAnswerIds,
      festivalVoteTokens,
      artworkAnswerIds,
      artworkVoteTokens,
      privateKey: getPrivateKey(VOTE_ACCOUNT_NAME),
    });

    const voteData = {
      artworkAnswerIds,
      artworkQuestionId,
      artworkVoteTokens,
      boothAddress,
      boothSignature,
      festivalAnswerIds,
      festivalQuestionId,
      festivalVoteTokens,
      nonce,
      senderAddress,
      senderSignature,
      organisationId,
      latitude,
      longitude,
    };

    setIsVoting(true);

    if (voteCallback) {
      voteCallback();
    }

    // Go vote!
    await dispatch(vote(voteData, requestId));
  };

  return (
    <Fragment>
      {isVoteSuccess ? (
        <ColorSection>
          <PaperContainerStyle>
            <PaperTicket>
              <BoxFramed>
                <ThreeCanvas style={{ height: '30rem' }}>
                  <Suspense fallback={null}>
                    <ThreeRotator max={10000} min={2000}>
                      <ThreeThankYou isAlternateColor={isAlternateColor} />
                    </ThreeRotator>
                  </Suspense>
                </ThreeCanvas>
              </BoxFramed>
            </PaperTicket>

            <PaperTicket>
              <ParagraphStyle>
                {translate('VoteSession.bodyYourVotesRecorded', {
                  count: Math.min(MAX_TOP_ARTWORKS, festivalAnswerIds.length),
                })}
              </ParagraphStyle>

              <HorizontalSpacingStyle />

              {highestVoteArtworks.map((artwork, index) => {
                return (
                  <HeadingSecondaryStyle key={index}>
                    {index + 1}. {artwork.title}
                  </HeadingSecondaryStyle>
                );
              })}

              <HorizontalLine />

              <ButtonGroup>
                {data.thankyouUrl ? (
                  <ButtonIcon href={data.thankyouUrl}>
                    {translate('VoteSession.buttonThankyou')}
                  </ButtonIcon>
                ) : null}

                <ButtonIcon to={`/festivals/${data.slug}`}>
                  {translate('VoteSession.buttonVoteResults')}
                </ButtonIcon>

                <ButtonIcon to="/">
                  {translate('VoteSession.buttonToHomepage')}
                </ButtonIcon>
              </ButtonGroup>
            </PaperTicket>
          </PaperContainerStyle>
        </ColorSection>
      ) : (
        <Fragment>
          <SnuggleRain snuggleness={snuggleness} />

          {isLoading ? (
            <Loading />
          ) : (
            <ColorSection>
              {currentStep === STEP_FESTIVAL ? (
                <Fragment>
                  <VoteCreditsBar
                    left={creditLeft[STEP_FESTIVAL]}
                    total={creditTotal[STEP_FESTIVAL]}
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
                        <VoteSessionArtwork
                          answerId={artwork.answerId}
                          credit={credits[STEP_FESTIVAL][artwork.answerId]}
                          creditTotal={creditTotal[STEP_FESTIVAL]}
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
                      <ButtonIcon
                        isDisabled={!winnerArtworkId}
                        onClick={onNextStep}
                      >
                        {translate('VoteSession.buttonNextStep')}
                      </ButtonIcon>
                    </PaperTicket>
                  </PaperContainerStyle>
                </Fragment>
              ) : (
                <Fragment>
                  <VoteCreditsBar
                    left={creditLeft[STEP_ARTWORK]}
                    total={creditTotal[STEP_ARTWORK]}
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
                        <VoteSessionProperty
                          answerId={property.answerId}
                          credit={credits[STEP_ARTWORK][property.answerId]}
                          creditTotal={creditTotal[STEP_ARTWORK]}
                          key={property.id}
                          title={property.title}
                          onCreditChange={onCreditChange}
                        />
                      );
                    })}

                    <PaperTicket>
                      <SpacingGroupStyle>
                        <ButtonGroup>
                          <ButtonIcon isIconFlipped onClick={onPreviousStep}>
                            {translate('VoteSession.buttonPreviousStep')}
                          </ButtonIcon>

                          <ButtonIcon
                            isDisabled={!hasVotedOnArtworks}
                            onClick={onVote}
                          >
                            {translate('VoteSession.buttonVote')}
                          </ButtonIcon>
                        </ButtonGroup>
                      </SpacingGroupStyle>
                    </PaperTicket>
                  </PaperContainerStyle>
                </Fragment>
              )}
            </ColorSection>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

const VoteSessionArtwork = (props) => {
  const stickerImagePath = useStickerImage(props.images);
  const { scheme } = useSticker(props.stickerCode);

  const onCreditChange = ({ id, credit }) => {
    props.onCreditChange({
      id,
      credit,
      stepName: STEP_FESTIVAL,
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

        <VoteSessionArtworkLegendStyle>
          <Legend scheme={scheme} title={translate('default.legendVote')} />
        </VoteSessionArtworkLegendStyle>
      </PaperTicket>
    </Suspense>
  );
};

const VoteSessionProperty = (props) => {
  const onCreditChange = ({ id, credit }) => {
    props.onCreditChange({
      id,
      credit,
      stepName: STEP_ARTWORK,
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

export const VoteSessionArtworkLegendStyle = styled.div`
  margin-top: 2rem;
  margin-left: 2.75rem;
`;

VoteSession.propTypes = {
  boothSignature: PropTypes.string.isRequired,
  festivalAnswerIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  festivalQuestionId: PropTypes.number.isRequired,
  nonce: PropTypes.number.isRequired,
  organisationId: PropTypes.number,
  senderAddress: PropTypes.string.isRequired,
  voteCallback: PropTypes.func,
};

VoteSessionArtwork.propTypes = {
  answerId: PropTypes.number.isRequired,
  credit: PropTypes.number.isRequired,
  creditTotal: PropTypes.number.isRequired,
  images: PropTypes.array,
  onCreditChange: PropTypes.func.isRequired,
  stickerCode: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

VoteSessionProperty.propTypes = {
  answerId: PropTypes.number.isRequired,
  credit: PropTypes.number.isRequired,
  creditTotal: PropTypes.number.isRequired,
  onCreditChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default VoteSession;
