import React, { Fragment, Suspense, useState } from 'react';

import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import HorizontalLine from '~/client/components/HorizontalLine';
import PaperTicket from '~/client/components/PaperTicket';
import SnuggleRain from '~/client/components/SnuggleRain';
import SnuggleSlider from '~/client/components/SnuggleSlider';
import Sticker from '~/client/components/Sticker';
import ThreeSplash from '~/client/components/ThreeSplash';
import View from '~/client/components/View';
import VoteCreditsBar from '~/client/components/VoteCreditsBar';
import translate from '~/common/services/i18n';
import { PaperContainerStyle, ContainerStyle } from '~/client/styles/layout';
import {
  ParagraphStyle,
  HeadingPrimaryStyle,
} from '~/client/styles/typography';
import styles from '~/client/styles/variables';

// @TODO: Remove this, this is only for testing
import image1 from '../../../uploads/images/159101135808114123117-threshold-thumb.png';
import image2 from '../../../uploads/images/1591024716692546129493-threshold-thumb.png';
import image3 from '../../../uploads/images/1593029408202364380581-threshold-thumb.png';

import swirl from '~/client/assets/images/swirl.svg';
import rectangle from '~/client/assets/images/rectangle.svg';

const Homepage = () => {
  const creditTotal = 25;

  const [credits, setCredits] = useState({
    0: 0,
    1: 0,
    2: 0,
  });

  const [snuggleness, setSnuggleness] = useState(0.0);
  const [creditLeft, setCreditLeft] = useState(creditTotal);

  const onCreditChange = ({ id, credit }) => {
    const creditOld = credits[id];
    const creditNew = Math.min(credit, creditOld + creditLeft);

    const creditsNew = Object.assign({}, credits, {
      [id]: creditNew,
    });
    setCredits(creditsNew);

    const creditsLeftNew = Object.keys(creditsNew).reduce((acc, creditId) => {
      return acc - creditsNew[creditId];
    }, creditTotal);
    setCreditLeft(creditsLeftNew);

    const totalVotePower = Math.sqrt(creditTotal);
    const currentVotePower = Math.sqrt(creditNew);
    setSnuggleness(currentVotePower / totalVotePower);
  };

  return (
    <Fragment>
      <View>
        <SnuggleRain snuggleness={snuggleness} />
        <VoteCreditsBar left={creditLeft} total={creditTotal} />

        <ThreeSplash />

        <ColorSection>
          <ContainerStyle>
            <ParagraphStyle>
              Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores
              similique aliquid laborum nobis maxime officiis. Quod delectus
              amet ut. Itaque similique qui excepturi sint eaque porro corrupti.
              Adipisci illum ea sint eaque.
            </ParagraphStyle>

            <ParagraphStyle>
              Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores
              similique aliquid laborum nobis maxime officiis. Quod delectus
              amet ut. Itaque similique qui excepturi sint eaque porro corrupti.
              Adipisci illum ea sint eaque.
            </ParagraphStyle>

            <HorizontalLine />
          </ContainerStyle>

          <PaperContainerStyle>
            <Suspense fallback={null}>
              <PaperTicket>
                <Sticker
                  clipPathId="clip-path-ellipsis"
                  particlePositions={[
                    { x: 20, y: 100 },
                    { x: 100, y: 20 },
                    { x: 250, y: 250 },
                    { x: 205, y: 230 },
                  ]}
                  scheme="pink"
                  src={image1}
                />

                <div style={{ position: 'relative', top: '-20px' }}>
                  <HeadingPrimaryStyle
                    style={{ textAlign: 'center', color: styles.colors.pink }}
                  >
                    Prototyping a Peoples park
                  </HeadingPrimaryStyle>

                  <ParagraphStyle
                    style={{
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      color: styles.colors.pink,
                    }}
                  >
                    Description of a project in a couple words
                  </ParagraphStyle>
                </div>

                <SnuggleSlider
                  credit={credits[0]}
                  id={0}
                  scheme="pink"
                  total={creditTotal}
                  onChange={onCreditChange}
                />
              </PaperTicket>

              <PaperTicket scheme="blue">
                <Sticker
                  clipPathId="clip-path-corners"
                  particlePath={swirl}
                  particlePositions={[
                    { x: 10, y: 150 },
                    { x: 100, y: 60 },
                    { x: 250, y: 150 },
                    { x: 280, y: 170 },
                    { x: 50, y: 20 },
                    { x: 205, y: 230 },
                  ]}
                  scheme="blue"
                  src={image2}
                />

                <div style={{ position: 'relative', top: '-20px' }}>
                  <HeadingPrimaryStyle
                    style={{ textAlign: 'center', color: styles.colors.blue }}
                  >
                    Solidarity Barbeque
                  </HeadingPrimaryStyle>

                  <ParagraphStyle
                    style={{
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      color: styles.colors.blue,
                    }}
                  >
                    Description of a project in a couple words
                  </ParagraphStyle>
                </div>

                <SnuggleSlider
                  credit={credits[1]}
                  id={1}
                  scheme="blue"
                  total={creditTotal}
                  onChange={onCreditChange}
                />
              </PaperTicket>

              <PaperTicket scheme="violet">
                <Sticker
                  clipPathId="clip-path-snake"
                  particlePath={rectangle}
                  particlePositions={[
                    { x: 20, y: 100 },
                    { x: 100, y: 20 },
                    { x: 250, y: 250 },
                    { x: 205, y: 230 },
                  ]}
                  scheme="violet"
                  src={image3}
                />

                <div style={{ position: 'relative', top: '-20px' }}>
                  <HeadingPrimaryStyle style={{ textAlign: 'center' }}>
                    Community Drumming
                  </HeadingPrimaryStyle>

                  <ParagraphStyle
                    style={{ textTransform: 'uppercase', textAlign: 'center' }}
                  >
                    Description of a project in a couple words
                  </ParagraphStyle>
                </div>

                <SnuggleSlider
                  credit={credits[2]}
                  id={2}
                  total={creditTotal}
                  onChange={onCreditChange}
                />
              </PaperTicket>
            </Suspense>
          </PaperContainerStyle>

          <ContainerStyle>
            <HorizontalLine />

            <ButtonIcon to="/festivals">
              {translate('Homepage.buttonViewFestivals')}
            </ButtonIcon>
          </ContainerStyle>
        </ColorSection>
      </View>
    </Fragment>
  );
};

export default Homepage;
