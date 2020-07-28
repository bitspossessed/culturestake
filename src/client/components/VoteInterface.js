import PropTypes from 'prop-types';
import React, { Fragment, Suspense, useState, useMemo } from 'react';

import ColorSection from '~/client/components/ColorSection';
import Loading from '~/client/components/Loading';
import PaperTicket from '~/client/components/PaperTicket';
import SnuggleRain from '~/client/components/SnuggleRain';
import SnuggleSlider from '~/client/components/SnuggleSlider';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import VoteCreditsBar from '~/client/components/VoteCreditsBar';
import { PaperContainerStyle } from '~/client/styles/layout';
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

  const [data, isLoading] = useResource(['questions', festivalQuestionId]);

  const artworks = useMemo(() => {
    if (isLoading || !data.answers) {
      return [];
    }

    return data.answers
      .filter((answer) => {
        return answer.artwork && festivalAnswerIds.includes(answer.id);
      })
      .map((answer) => {
        answer.artwork.answerId = answer.id;
        return answer.artwork;
      });
  }, [festivalAnswerIds, isLoading, data]);

  return (
    <Fragment>
      <SnuggleRain snuggleness={snuggleness} />
      <VoteCreditsBar left={creditLeft} total={creditTotal} />

      {isLoading ? (
        <Loading />
      ) : (
        <ColorSection>
          <PaperContainerStyle>
            {artworks.map((artwork) => {
              return (
                <VoteInterfaceItem
                  answerId={artwork.answerId}
                  artistName={artwork.artist.name}
                  credit={credits[artwork.answerId]}
                  creditTotal={creditTotal}
                  images={artwork.images}
                  key={artwork.id}
                  stickerCode={artwork.sticker}
                  title={artwork.title}
                  onCreditChange={onCreditChange}
                />
              );
            })}
          </PaperContainerStyle>
        </ColorSection>
      )}
    </Fragment>
  );
};

const VoteInterfaceItem = (props) => {
  const stickerImagePath = useStickerImage(props.images);
  const { scheme } = useSticker(props.stickerCode);

  return (
    <Suspense fallback={null}>
      <PaperTicket scheme={scheme}>
        <Sticker code={props.stickerCode} imagePath={stickerImagePath} />

        <StickerHeading
          scheme={scheme}
          subtitle={props.artistName}
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

VoteInterfaceItem.propTypes = {
  answerId: PropTypes.number.isRequired,
  artistName: PropTypes.string.isRequired,
  credit: PropTypes.number.isRequired,
  creditTotal: PropTypes.number.isRequired,
  images: PropTypes.array,
  onCreditChange: PropTypes.func.isRequired,
  stickerCode: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default VoteInterface;
