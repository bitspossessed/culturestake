import React, { Fragment, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import BoxFramed from '~/client/components/BoxFramed';
import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import VoteResult from '~/client/components/VoteResult';
import Loading from '~/client/components/Loading';
import Paper from '~/client/components/Paper';
import PaperTicket from '~/client/components/PaperTicket';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import UnderlineLink from '~/client/components/UnderlineLink';
import View from '~/client/components/View';
import translate from '~/common/services/i18n';
import {
  ContainerStyle,
  HorizontalSpacingStyle,
  PaperContainerStyle,
} from '~/client/styles/layout';
import {
  ParagraphStyle,
  HeadingSecondaryStyle,
} from '~/client/styles/typography';
import { useResource } from '~/client/hooks/requests';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const FestivalsProfile = () => {
  const params = useParams();
  const history = useHistory();

  // Load festivals and all connected questions
  const [festival, isFestivalLoading] = useResource(
    ['festivals', params.slug, 'questions'],
    {
      onError: () => {
        history.push('/404');
      },
    },
  );

  // Find the festival question ...
  const festivalQuestion = useMemo(() => {
    if (!festival || !festival.questions) {
      return;
    }

    return festival.questions.find((question) => {
      return question.artwork === null;
    });
  }, [festival]);

  // ... to load the vote results!
  const [results] = useResource(
    festivalQuestion ? ['votes', festivalQuestion.slug, 'results'] : [],
    {
      onError: () => {
        history.push('/404');
      },
    },
  );

  // Get the question title and artworks we are interested in
  const questionTitle = results.title;

  const artworks =
    results &&
    results.answers &&
    results.answers.reduce((acc, { artwork, voteTokens, votePower }) => {
      if (artwork) {
        acc.push({
          ...artwork,
          votePower,
          voteTokens,
        });
      }

      return acc;
    }, []);

  const maxVotePower = !artworks
    ? 0
    : Math.max(...artworks.map((artwork) => artwork.votePower));

  // Get the sticker and color scheme
  const stickerImagePath = useStickerImage(festival.images);
  const { scheme } = useSticker(festival.sticker);

  return (
    <View>
      <ColorSection scheme={scheme}>
        {isFestivalLoading ? (
          <Loading />
        ) : (
          <Fragment>
            <PaperContainerStyle>
              <Paper scheme={scheme}>
                <Sticker code={festival.sticker} imagePath={stickerImagePath} />

                <StickerHeading
                  scheme={scheme}
                  subtitle={festival.subtitle}
                  title={festival.title}
                />
              </Paper>

              <Paper>
                <ContainerStyle>
                  <ParagraphStyle>{festival.description}</ParagraphStyle>

                  {festival.url && (
                    <ParagraphStyle>
                      <UnderlineLink href={festival.url}>
                        {translate('FestivalsProfile.buttonGoToWebsite')}
                      </UnderlineLink>
                    </ParagraphStyle>
                  )}
                </ContainerStyle>

                <HorizontalSpacingStyle isLarge />
              </Paper>

              <PaperTicket>
                {questionTitle && artworks && artworks.length > 0 && (
                  <Fragment>
                    <BoxFramed>
                      <HeadingSecondaryStyle>
                        {questionTitle}
                      </HeadingSecondaryStyle>
                    </BoxFramed>

                    <HorizontalSpacingStyle isLarge />

                    {artworks.map((artwork, idx) => {
                      return (
                        <PaperTicket key={artwork.id}>
                          <VoteResult
                            credit={artwork.votePower}
                            images={artwork.images}
                            rank={idx + 1}
                            sticker={artwork.sticker}
                            subtitle={artwork.artist.name}
                            title={artwork.title}
                            total={maxVotePower}
                            type="artwork"
                          />
                        </PaperTicket>
                      );
                    })}

                    <HorizontalSpacingStyle isLarge />
                  </Fragment>
                )}

                <HorizontalSpacingStyle />

                <ButtonIcon to={`/festivals/${festival.slug}/artworks`}>
                  {translate('FestivalsProfile.buttonShowAllArtworks')}
                </ButtonIcon>
              </PaperTicket>
            </PaperContainerStyle>
          </Fragment>
        )}
      </ColorSection>
    </View>
  );
};

export default FestivalsProfile;
