import React, { Fragment } from 'react';

import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import StickerWithHeading from '~/client/components/StickerWithHeading';
import View from '~/client/components/View';
import { PaperContainerStyle, ContainerStyle } from '~/client/styles/layout';
import { usePaginatedResource } from '~/client/hooks/resources';

const Festivals = () => {
  return (
    <Fragment>
      <View>
        <ColorSection>
          <FestivalsList />
        </ColorSection>
      </View>
    </Fragment>
  );
};

const FestivalsList = () => {
  const [festivals, loadMoreFestivals, hasMore] = usePaginatedResource([
    'festivals',
  ]);

  return (
    <Fragment>
      <PaperContainerStyle>
        {festivals.map((festival) => {
          const stickerImagePath =
            festival.images.length > 0
              ? festival.images[0].urlThresholdThumb
              : null;

          return (
            <StickerWithHeading
              code={festival.sticker}
              imagePath={stickerImagePath}
              key={festival.id}
              subtitle={festival.subtitle}
              title={festival.title}
            />
          );
        })}
      </PaperContainerStyle>

      {hasMore && (
        <ContainerStyle>
          <ButtonIcon onClick={loadMoreFestivals}>More</ButtonIcon>
        </ContainerStyle>
      )}
    </Fragment>
  );
};

export default Festivals;
