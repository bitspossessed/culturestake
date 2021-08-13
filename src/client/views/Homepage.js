import React, { Fragment } from 'react';
import styled from 'styled-components';

import ButtonGroup from '~/client/components/ButtonGroup';
import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import ThreeSplash from '~/client/components/ThreeSplash';
import View from '~/client/components/View';
import translate from '~/common/services/i18n';
import { ContainerStyle, HorizontalSpacingStyle } from '~/client/styles/layout';
import { ParagraphStyle } from '~/client/styles/typography';
import { HeadingPrimaryStyle } from '~/client/styles/typography';

const FURTHERFIELD_URL = 'https://www.furtherfield.org';

const Homepage = () => {
  return (
    <Fragment>
      <View>
        <ThreeSplash />

        <ColorSection>
          <ContainerStyle>
            <HorizontalSpacingStyle />

            <HeadingPrimaryStyle>
              {translate('Homepage.heading')}
            </HeadingPrimaryStyle>

            <HorizontalSpacingStyle />

            <ParagraphStyle>
              {translate('Homepage.bodyIntroduction')}
            </ParagraphStyle>

            <ButtonIcon to="/festivals">
              {translate('Homepage.buttonViewFestivals')}
            </ButtonIcon>

            <ParagraphStyle>
              {translate('Homepage.bodyIntroductionSecondary')}
            </ParagraphStyle>

            <ul>
              <li>
                <ParagraphStyle>
                  {translate('Homepage.bodySecondBulletOne')}
                </ParagraphStyle>
              </li>
              <li>
                <ParagraphStyle>
                  {translate('Homepage.bodySecondBulletTwo')}
                </ParagraphStyle>
              </li>
              <li>
                <ParagraphStyle>
                  {translate('Homepage.bodySecondBulletThree')}
                </ParagraphStyle>
              </li>
            </ul>

            <ParagraphStyle>
              {translate('Homepage.bodyIntroductionThird')}
            </ParagraphStyle>

            <HorizontalSpacingStyle />

            <HeadingPrimaryStyle>
              {translate('Homepage.bodyThirdBulletOne')}
            </HeadingPrimaryStyle>

            <HorizontalSpacingStyle />

            <ParagraphStyle>
              {translate('Homepage.bodyThirdBulletOneFollowup')}
            </ParagraphStyle>

            <HorizontalSpacingStyle />

            <HeadingPrimaryStyle>
              {translate('Homepage.bodyThirdBulletTwo')}
            </HeadingPrimaryStyle>

            <HorizontalSpacingStyle />

            <ParagraphStyle>
              {translate('Homepage.bodyThirdBulletTwoFollowup')}
            </ParagraphStyle>

            <HorizontalSpacingStyle />

            <HeadingPrimaryStyle>
              {translate('Homepage.bodyThirdBulletThree')}
            </HeadingPrimaryStyle>

            <HorizontalSpacingStyle />

            <ParagraphStyle>
              {translate('Homepage.bodyThirdBulletThreeFollowup')}
            </ParagraphStyle>

            <HorizontalSpacingStyle />

            <VideoItem />

            <ButtonIcon
              href={
                'https://docs.google.com/document/d/1gzvD9XIg7-EhT5MZCFHiBuO9VGlPFUa0VAO7StpJAag/edit'
              }
            >
              {translate('Invitations.buttonFAQ')}
            </ButtonIcon>

            <HorizontalSpacingStyle />

            <HeadingPrimaryStyle>
              {translate('Homepage.headingThree')}
            </HeadingPrimaryStyle>

            <ParagraphStyle>
              <strong>{translate('Homepage.bodyQuestion')}</strong>
              {translate('Homepage.bodyAnswer')}
            </ParagraphStyle>

            <ParagraphStyle>
              <strong>{translate('Homepage.bodyQuestionSecond')}</strong>
              {translate('Homepage.bodyAnswerSecond')}
            </ParagraphStyle>

            <ParagraphStyle>
              <strong>{translate('Homepage.bodyQuestionThird')}</strong>
              {translate('Homepage.bodyAnswerThird')}
              <a
                href="mailto:charlotte.frost@furtherfield.org"
                style={{ color: '#ba00ff' }}
              >
                Charlotte Frost
              </a>
            </ParagraphStyle>

            <HorizontalSpacingStyle />

            <ButtonGroup>
              <ButtonIcon href={FURTHERFIELD_URL}>
                {translate('Homepage.buttonFurtherfield')}
              </ButtonIcon>
            </ButtonGroup>
          </ContainerStyle>
        </ColorSection>
      </View>
    </Fragment>
  );
};

const VideoItem = () => {
  return (
    <VideoItemStyle
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      frameBorder="0"
      src="https://player.vimeo.com/video/523730680?title=0&byline=0"
    ></VideoItemStyle>
  );
};

const VideoItemStyle = styled.iframe`
  @media max-width 500px {
    height: 20rem;
  }

  width: 100%;
  height: 50rem;
`;

export default Homepage;
