import React from 'react';

import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import StickerWithHeading from '~/client/components/StickerWithHeading';
import View from '~/client/components/View';
import translate from '~/common/services/i18n';
import { Link } from 'react-router-dom';
import { PaperContainerStyle, ContainerStyle } from '~/client/styles/layout';
import { usePaginatedResource } from '~/client/hooks/resources';

const Festivals = () => {
  const [festivals, loadMoreFestivals, hasMore] = usePaginatedResource([
    'festivals',
  ]);

  return (
    <View>
      <ColorSection>
        <PaperContainerStyle>
          {festivals.map((festival) => {
            const stickerImagePath =
              festival.images.length > 0
                ? festival.images[0].urlThresholdThumb
                : null;

            return (
              <Link key={festival.id} to={`/festivals/${festival.slug}`}>
                <StickerWithHeading
                  code={festival.sticker}
                  imagePath={stickerImagePath}
                  subtitle={festival.subtitle}
                  title={festival.title}
                />
              </Link>
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
      </ColorSection>
    </View>
  );
};

export default Festivals;
