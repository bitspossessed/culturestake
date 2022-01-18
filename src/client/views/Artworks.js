import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import Loading from '~/client/components/Loading';
import PaperStamp from '~/client/components/PaperStamp';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import View from '~/client/components/View';
import translate from '~/common/services/i18n';
import { PaperContainerStyle } from '~/client/styles/layout';
import { usePaginatedResource } from '~/client/hooks/requests';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const Artworks = () => {
  const params = useParams();

  const [
    artworks,
    loadMoreArtworks,
    hasMore,
    isPending,
  ] = usePaginatedResource(['festivals', params.festivalSlug, 'artworks']);

  return (
    <View>
      <ColorSection>
        {isPending ? (
          <Loading />
        ) : (
          <Fragment>
            <PaperContainerStyle>
              {artworks.map((artwork) => {
                return (
                  <ArtworksItem
                    festivalSlug={params.festivalSlug}
                    imageCredits={artwork.imageCredits}
                    images={artwork.images}
                    key={artwork.id}
                    slug={artwork.slug}
                    stickerCode={artwork.sticker}
                    subtitle={`${artwork.artist.name}`}
                    title={artwork.title}
                  />
                );
              })}

              <PaperStamp>
                {hasMore && (
                  <ButtonIcon onClick={loadMoreArtworks}>
                    ${translate('default.buttonLoadMore')}
                  </ButtonIcon>
                )}

                <ButtonIcon isIconFlipped to={`/events/${params.festivalSlug}`}>
                  {translate('Artworks.buttonBackToFestival')}
                </ButtonIcon>
              </PaperStamp>
            </PaperContainerStyle>
          </Fragment>
        )}
      </ColorSection>
    </View>
  );
};

const ArtworksItem = ({
  festivalSlug,
  images,
  slug,
  stickerCode,
  subtitle,
  title,
}) => {
  const stickerImagePath = useStickerImage(images);
  const { scheme } = useSticker(stickerCode);

  return (
    <Link to={`/events/${festivalSlug}/artworks/${slug}`}>
      <PaperStamp scheme={scheme}>
        <Sticker code={stickerCode} imagePath={stickerImagePath} />
        <StickerHeading scheme={scheme} subtitle={subtitle} title={title} />
      </PaperStamp>
    </Link>
  );
};

ArtworksItem.propTypes = {
  festivalSlug: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  stickerCode: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Artworks;
