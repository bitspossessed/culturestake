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
import { ParagraphStyle } from '~/client/styles/typography';

import image1 from '../../../uploads/images/159101135808114123117-threshold-thumb.png';

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
                <Sticker src={image1} />

                <SnuggleSlider
                  credit={credits[0]}
                  id={0}
                  total={creditTotal}
                  onChange={onCreditChange}
                />
              </PaperTicket>

              <PaperTicket scheme="blue">
                <Sticker scheme="blue" src={image1} />

                <SnuggleSlider
                  credit={credits[1]}
                  id={1}
                  scheme="blue"
                  total={creditTotal}
                  onChange={onCreditChange}
                />
              </PaperTicket>

              <PaperTicket scheme="violet">
                <Sticker scheme="violet" src={image1} />

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
