import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import Loading from '~/client/components/Loading';
import Paper from '~/client/components/Paper';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import View from '~/client/components/View';
import translate from '~/common/services/i18n';
import { PaperContainerStyle, ContainerStyle } from '~/client/styles/layout';
import { usePaginatedResource } from '~/client/hooks/requests';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const Festivals = () => {
  const [
    festivals,
    loadMoreFestivals,
    hasMore,
    isPending,
  ] = usePaginatedResource(['festivals']);

  return (
    <View>
      <ColorSection>
        {isPending ? (
          <Loading />
        ) : (
          <Fragment>
            <PaperContainerStyle>
              {festivals.map((festival) => {
                return (
                  <FestivalsItem
                    images={festival.images}
                    key={festival.id}
                    slug={festival.slug}
                    stickerCode={festival.sticker}
                    subtitle={festival.subtitle}
                    title={festival.title}
                  />
                );
              })}
            </PaperContainerStyle>

            {hasMore && (
              <ContainerStyle>
                <ButtonIcon onClick={loadMoreFestivals}>
                  ${translate('default.buttonLoadMore')}
                </ButtonIcon>
              </ContainerStyle>
            )}
          </Fragment>
        )}
      </ColorSection>
    </View>
  );
};

const FestivalsItem = ({ slug, stickerCode, images, subtitle, title }) => {
  const stickerImagePath = useStickerImage(images);
  const { scheme } = useSticker(stickerCode);

  return (
    <Link to={`/events/${slug}`}>
      <Paper scheme={scheme}>
        <Sticker code={stickerCode} imagePath={stickerImagePath} />
        <StickerHeading scheme={scheme} subtitle={subtitle} title={title} />
      </Paper>
    </Link>
  );
};

FestivalsItem.propTypes = {
  images: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  stickerCode: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Festivals;
