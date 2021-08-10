import PropTypes from 'prop-types';
import React, { Fragment, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import BoxFramed from '~/client/components/BoxFramed';
import ButtonGroup from '~/client/components/ButtonGroup';
import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import VoteResult from '~/client/components/VoteResult';
import Image from '~/client/components/Image';
import Loading from '~/client/components/Loading';
import PaperTicket from '~/client/components/PaperTicket';
import Slider from '~/client/components/Slider';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import UnderlineLink from '~/client/components/UnderlineLink';
import View from '~/client/components/View';
import translate from '~/common/services/i18n';
import {
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
    artworkQuestion ? ['votes', artworkQuestion.slug, 'results'] : [],
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

  const maxVotePower = !properties
    ? 0
    : Math.max(...properties.map((property) => property.votePower));

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

              {(artwork.images.length > 0 ||
                artwork.description ||
                artwork.descriptionCommission) && (
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

                  <HorizontalSpacingStyle />

                  {artwork.description && (
                    <Fragment>
                      <ParagraphStyle>
                        {translate('ArtworksProfile.titleArtworkDescription')}
                      </ParagraphStyle>

                      <ParagraphStyle>{artwork.description}</ParagraphStyle>
                    </Fragment>
                  )}

                  {artwork.descriptionCommission && (
                    <Fragment>
                      <ParagraphStyle>
                        {translate(
                          'ArtworksProfile.titleArtworkDescriptionCommission',
                        )}
                      </ParagraphStyle>

                      <ParagraphStyle>
                        {artwork.descriptionCommission}
                      </ParagraphStyle>
                    </Fragment>
                  )}

                  {artwork.url && (
                    <ParagraphStyle>
                      <UnderlineLink href={artwork.url}>
                        {translate('ArtworksProfile.buttonGoToArtworkWebsite')}
                      </UnderlineLink>
                    </ParagraphStyle>
                  )}
                </PaperTicket>
              )}

              {artwork.artist.bio && (
                <PaperTicket>
                  <ParagraphStyle>
                    {translate('ArtworksProfile.titleArtistDescription')}
                  </ParagraphStyle>

                  <ParagraphStyle>{artwork.artist.bio}</ParagraphStyle>

                  {artwork.artist.url && (
                    <ParagraphStyle>
                      <UnderlineLink href={artwork.artist.url}>
                        {translate('ArtworksProfile.buttonGoToArtistWebsite')}
                      </UnderlineLink>
                    </ParagraphStyle>
                  )}
                </PaperTicket>
              )}

              <PaperTicket>
                {questionTitle && properties && (
                  <Fragment>
                    <BoxFramed>
                      <HeadingSecondaryStyle>
                        {questionTitle}
                      </HeadingSecondaryStyle>
                    </BoxFramed>

                    <HorizontalSpacingStyle isLarge />

                    {properties.map((property, idx) => {
                      console.log(property) // eslint-disable-line
                      return (
                        <PaperTicket key={property.id}>
                          <VoteResult
                            credit={property.votePower}
                            images={artwork.images}
                            rank={idx + 1}
                            sticker={artwork.sticker}
                            subtitle={property.title}
                            title={property.title}
                            total={maxVotePower}
                            type="property"
                          />
                        </PaperTicket>
                      );
                    })}

                    <HorizontalSpacingStyle />
                  </Fragment>
                )}

                <HorizontalSpacingStyle isLarge />

                <ButtonGroup>
                  <ButtonIcon
                    isIconFlipped
                    to={`/festivals/${festival.slug}/artworks`}
                  >
                    {translate('ArtworksProfile.buttonBackToFestivalArtworks')}
                  </ButtonIcon>

                  <ButtonIcon isIconFlipped to={`/festivals/${festival.slug}`}>
                    {translate('ArtworksProfile.buttonBackToFestival')}
                  </ButtonIcon>
                </ButtonGroup>
              </PaperTicket>
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
      <Slider credit={props.credit} scheme={props.scheme} total={props.total} />
      <HorizontalSpacingStyle />
    </Fragment>
  );
};

ArtworksProfileProperty.propTypes = {
  credit: PropTypes.number.isRequired,
  scheme: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};

export default ArtworksProfile;
