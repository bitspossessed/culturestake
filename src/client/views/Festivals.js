import React, {
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';

import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import PaperTicket from '~/client/components/PaperTicket';
import Sticker from '~/client/components/Sticker';
import View from '~/client/components/View';
import apiRequest from '~/client/services/api';
import { PaperContainerStyle, ContainerStyle } from '~/client/styles/layout';
import {
  HeadingPrimaryStyle,
  ParagraphStyle,
} from '~/client/styles/typography';
import styles from '~/client/styles/variables';

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
  const [festivals, setFestivals] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const loadMoreFestivals = useCallback(async () => {
    const { results, pagination } = await apiRequest({
      path: ['festivals'],
      body: {
        offset,
        orderDirection: 'ASC',
        orderKey: 'title',
      },
    });

    setFestivals((festivals) => festivals.concat(results));
    setHasMore(pagination.offset + pagination.limit < pagination.total);
    setOffset((offset) => offset + pagination.limit);
  }, [offset]);

  useEffect(() => {
    loadMoreFestivals();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <PaperContainerStyle>
        {festivals.map((festival) => {
          const stickerImagePath =
            festival.images.length > 0 && festival.images[0].urlThresholdThumb;

          return (
            <Suspense fallback={null} key={festival.id}>
              <PaperTicket>
                <Sticker code={festival.sticker} imagePath={stickerImagePath} />

                <HeadingPrimaryStyle
                  style={{ textAlign: 'center', color: styles.colors.pink }}
                >
                  {festival.title}
                </HeadingPrimaryStyle>

                <ParagraphStyle
                  style={{
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    color: styles.colors.pink,
                  }}
                >
                  {festival.subtitle}
                </ParagraphStyle>
              </PaperTicket>
            </Suspense>
          );
        })}
      </PaperContainerStyle>

      <ContainerStyle>
        {hasMore && <ButtonIcon onClick={loadMoreFestivals}>More</ButtonIcon>}
      </ContainerStyle>
    </Fragment>
  );
};

export default Festivals;
