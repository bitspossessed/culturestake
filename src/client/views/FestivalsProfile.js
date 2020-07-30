import PropTypes from 'prop-types';
import React, { Fragment, useMemo } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';

import ButtonMore from '~/client/components/ButtonMore';
import ColorSection from '~/client/components/ColorSection';
import BoxFramed from '~/client/components/BoxFramed';
import Loading from '~/client/components/Loading';
import Slider from '~/client/components/Slider';
import Paper from '~/client/components/Paper';
import PaperTicket from '~/client/components/PaperTicket';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import View from '~/client/components/View';
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
    festivalQuestion ? ['votes', festivalQuestion.slug] : [],
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
                </ContainerStyle>

                <HorizontalSpacingStyle isLarge />
              </Paper>

              {questionTitle && artworks && (
                <PaperTicket>
                  <BoxFramed>
                    <HeadingSecondaryStyle>
                      {questionTitle}
                    </HeadingSecondaryStyle>
                  </BoxFramed>

                  <HorizontalSpacingStyle />

                  {artworks.map((artwork) => {
                    return (
                      <FestivalProfileArtwork
                        artistName={artwork.artist.name}
                        artworkSlug={artwork.slug}
                        festivalSlug={festival.slug}
                        key={artwork.id}
                        scheme={scheme}
                        title={artwork.title}
                        votePower={artwork.votePower}
                        voteTokens={artwork.voteTokens}
                      />
                    );
                  })}
                </PaperTicket>
              )}
            </PaperContainerStyle>
          </Fragment>
        )}
      </ColorSection>
    </View>
  );
};

const FestivalProfileArtwork = (props) => {
  return (
    <FestivalProfileArtworkStyle>
      <FestivalProfileArtworkButtonStyle>
        <ButtonMore
          to={`/festivals/${props.festivalSlug}/artworks/${props.artworkSlug}`}
        />
      </FestivalProfileArtworkButtonStyle>

      <HeadingSecondaryStyle>{props.title}</HeadingSecondaryStyle>
      <HeadingSecondaryStyle>{props.artistName}</HeadingSecondaryStyle>

      <Slider
        credit={props.voteTokens}
        scheme={props.scheme}
        total={props.votePower}
      />

      <HorizontalSpacingStyle />
    </FestivalProfileArtworkStyle>
  );
};

export const FestivalProfileArtworkStyle = styled.div`
  position: relative;
`;

export const FestivalProfileArtworkButtonStyle = styled.div`
  position: absolute;

  top: 0;
  right: 0;
`;

FestivalProfileArtwork.propTypes = {
  artistName: PropTypes.string.isRequired,
  artworkSlug: PropTypes.string.isRequired,
  festivalSlug: PropTypes.string.isRequired,
  scheme: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  votePower: PropTypes.number.isRequired,
  voteTokens: PropTypes.number.isRequired,
};

export default FestivalsProfile;
