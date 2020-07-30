import PropTypes from 'prop-types';
import React, { Fragment, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import BoxFramed from '~/client/components/BoxFramed';
import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import Legend from '~/client/components/Legend';
import Image from '~/client/components/Image';
import Loading from '~/client/components/Loading';
import PaperTicket from '~/client/components/PaperTicket';
import Slider from '~/client/components/Slider';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
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

const ArtworksProfile = () => {
  const params = useParams();
  const history = useHistory();

  // Load festivals and all connected questions
  const [festival, isFestivalLoading] = useResource(
    ['festivals', params.festivalSlug, 'questions'],
    {
      onError: () => {
        history.push('/404');
      },
    },
  );

  // Load artwork ..
  const [artwork, isArtworkLoading] = useResource(
    ['artworks', params.artworkSlug],
    {
      onError: () => {
        history.push('/404');
      },
    },
  );

  // Find the artwork question ...
  const artworkQuestion = useMemo(() => {
    if (!festival || !festival.questions) {
      return;
    }

    return festival.questions.find((question) => {
      return question.artwork && question.artwork.slug === params.artworkSlug;
    });
  }, [festival, params.artworkSlug]);

  // ... to load the vote results!
  const [results] = useResource(
    artworkQuestion ? ['votes', artworkQuestion.slug] : [],
    {
      onError: () => {
        history.push('/404');
      },
    },
  );

  // Get the question title and properties we are interested in
  const questionTitle = results.title;

  const properties =
    results &&
    results.answers &&
    results.answers.reduce((acc, { property, voteTokens, votePower }) => {
      if (property) {
        acc.push({
          ...property,
          votePower,
          voteTokens,
        });
      }

      return acc;
    }, []);

  // Get the sticker and color scheme
  const stickerImagePath = useStickerImage(artwork.images);
  const { scheme } = useSticker(artwork.sticker);

  return (
    <View>
      <ColorSection scheme={scheme}>
        {isFestivalLoading || isArtworkLoading ? (
          <Loading />
        ) : (
          <Fragment>
            <PaperContainerStyle>
              <PaperTicket scheme={scheme}>
                <Sticker code={artwork.sticker} imagePath={stickerImagePath} />

                <StickerHeading
                  scheme={scheme}
                  subtitle={`${artwork.artist.name} / ${festival.title}`}
                  title={artwork.title}
                />
              </PaperTicket>

              {(artwork.images.length > 0 || artwork.description) && (
                <PaperTicket>
                  {artwork.images.map((image) => {
                    return (
                      <Image
                        key={image.id}
                        scheme={scheme}
                        src={image.urlThreshold}
                        srcOriginal={image.url}
                      />
                    );
                  })}

                  {artwork.description && (
                    <ContainerStyle>
                      <ParagraphStyle>
                        {translate('ArtworksProfile.titleArtworkDescription')}
                      </ParagraphStyle>

                      <ParagraphStyle>{artwork.description}</ParagraphStyle>
                    </ContainerStyle>
                  )}
                </PaperTicket>
              )}

              {artwork.artist.bio && (
                <PaperTicket>
                  <ContainerStyle>
                    <ParagraphStyle>
                      {translate('ArtworksProfile.titleArtistDescription')}
                    </ParagraphStyle>

                    <ParagraphStyle>{artwork.artist.bio}</ParagraphStyle>
                  </ContainerStyle>
                </PaperTicket>
              )}

              {questionTitle && properties && (
                <PaperTicket>
                  <BoxFramed>
                    <HeadingSecondaryStyle>
                      {questionTitle}
                    </HeadingSecondaryStyle>
                  </BoxFramed>

                  <HorizontalSpacingStyle />

                  {properties.map((property) => {
                    return (
                      <ArtworksProfileProperty
                        key={property.id}
                        scheme={scheme}
                        title={property.title}
                        votePower={property.votePower}
                        voteTokens={property.voteTokens}
                      />
                    );
                  })}

                  <Legend
                    scheme={scheme}
                    title={translate('default.legendVotes')}
                  />

                  <HorizontalSpacingStyle />

                  <ButtonIcon isIconFlipped to={`/festivals/${festival.slug}`}>
                    {translate('ArtworksProfile.buttonBackToFestival')}
                  </ButtonIcon>
                </PaperTicket>
              )}
            </PaperContainerStyle>
          </Fragment>
        )}
      </ColorSection>
    </View>
  );
};

const ArtworksProfileProperty = (props) => {
  return (
    <Fragment>
      <HeadingSecondaryStyle>{props.title}</HeadingSecondaryStyle>

      <Slider
        credit={props.voteTokens}
        scheme={props.scheme}
        total={props.votePower}
      />

      <HorizontalSpacingStyle />
    </Fragment>
  );
};

ArtworksProfileProperty.propTypes = {
  scheme: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  votePower: PropTypes.number.isRequired,
  voteTokens: PropTypes.number.isRequired,
};

export default ArtworksProfile;
