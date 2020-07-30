import React, { Fragment } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import ColorSection from '~/client/components/ColorSection';
import BoxFramed from '~/client/components/BoxFramed';
import Loading from '~/client/components/Loading';
import Paper from '~/client/components/Paper';
import PaperTicket from '~/client/components/PaperTicket';
import Sticker from '~/client/components/Sticker';
import StickerHeading from '~/client/components/StickerHeading';
import View from '~/client/components/View';
import { PaperContainerStyle, ContainerStyle } from '~/client/styles/layout';
import {
  ParagraphStyle,
  HeadingSecondaryStyle,
} from '~/client/styles/typography';
import { useResource } from '~/client/hooks/requests';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const FestivalsProfile = () => {
  const params = useParams();
  const history = useHistory();

  const [festival, isLoading] = useResource(['festivals', params.slug], {
    onError: () => {
      history.push('/404');
    },
  });

  const stickerImagePath = useStickerImage(festival.images);
  const { scheme } = useSticker(festival.sticker);

  return (
    <View>
      <ColorSection>
        {isLoading ? (
          <ContainerStyle>
            <Loading />
          </ContainerStyle>
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
            </PaperContainerStyle>

            <PaperContainerStyle>
              <Paper>
                <ContainerStyle>
                  <ParagraphStyle>{festival.description}</ParagraphStyle>
                </ContainerStyle>
              </Paper>

              <PaperTicket>
                <BoxFramed>
                  <HeadingSecondaryStyle>
                    Example question?
                    {/* @TODO */}
                  </HeadingSecondaryStyle>
                </BoxFramed>
              </PaperTicket>
            </PaperContainerStyle>
          </Fragment>
        )}
      </ColorSection>
    </View>
  );
};

export default FestivalsProfile;
