import PropTypes from 'prop-types';
import React, { Fragment, Suspense, useState, useMemo } from 'react';

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
import { useResource } from '~/client/hooks/resources';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const VoteInterface = ({ festivalQuestionId, festivalAnswerIds }) => {
  const creditTotal = 25;

  const [credits, setCredits] = useState(
    festivalAnswerIds.reduce((acc, id) => {
      acc[id] = 0;
      return acc;
    }, {}),
  );

  const [step, setStep] = useState(0);
  const [snuggleness, setSnuggleness] = useState(0.0);
  const [creditLeft, setCreditLeft] = useState(creditTotal);

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

  // Load question and answer data
  const [data, isLoading] = useResource(['questions', festivalQuestionId]);

  // Filter artworks for first question
  const artworks = useMemo(() => {
    if (isLoading || !data.answers) {
      return [];
    }

    return data.answers.reduce((acc, answer) => {
      if (answer.artwork && festivalAnswerIds.includes(answer.id)) {
        acc.push({
          ...answer.artwork,
          answerId: answer.id,
        });
        return acc;
      }
    }, []);
  }, [festivalAnswerIds, isLoading, data]);

  const onNextStep = () => {
  };

  return (
    <Fragment>
      <SnuggleRain snuggleness={snuggleness} />
      <VoteCreditsBar left={creditLeft} total={creditTotal} />

      {isLoading ? (
        <Loading />
      ) : (
        <ColorSection>
          {step === 0 ? (
            <Fragment>
              <PaperContainerStyle>
                <PaperTicket>
                  <BoxFramed>
                    <HeadingPrimaryStyle>{data.title}</HeadingPrimaryStyle>
                  </BoxFramed>
                </PaperTicket>

                {artworks.map((artwork) => {
                  return (
                    <VoteInterfaceArtwork
                      answerId={artwork.answerId}
                      credit={credits[artwork.answerId]}
                      creditTotal={creditTotal}
                      images={artwork.images}
                      key={artwork.id}
                      stickerCode={artwork.sticker}
                      subtitle={artwork.subtitle}
                      title={artwork.title}
                      onCreditChange={onCreditChange}
                    />
                  );
                })}
              </PaperContainerStyle>

              <ContainerStyle>
                <PaperTicket>
                  <ButtonIcon
                    disabled={festivalAnswerIds.length === 0}
                    onClick={onNextStep}
                  >
                    {translate('Vote.buttonNextStep')}
                  </ButtonIcon>
                </PaperTicket>
              </ContainerStyle>
            </Fragment>
          ) : (
            <PaperContainerStyle>
              <p>Properties</p>
            </PaperContainerStyle>
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
