import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';

import ButtonIcon from '~/client/components/ButtonIcon';
import ColorSection from '~/client/components/ColorSection';
import HorizontalLine from '~/client/components/HorizontalLine';
import ThreeSplash from '~/client/components/ThreeSplash';
import View from '~/client/components/View';
import apiRequest from '~/client/services/api';
import styles from '~/client/styles/variables';
import translate from '~/common/services/i18n';
import { ContainerStyle } from '~/client/styles/layout';
import { ParagraphStyle } from '~/client/styles/typography';

const Homepage = () => {
  return (
    <Fragment>
      <View>
        <ThreeSplash />

        <ColorSection>
          <ContainerStyle>
            <ParagraphStyle>
              {translate('Homepage.bodyIntroduction')}
            </ParagraphStyle>

            <ParagraphStyle>
              {translate('Homepage.bodyIntroductionSecondary')}
            </ParagraphStyle>

            <HomepageStatistics />

            <ButtonIcon to="/festivals">
              {translate('Homepage.buttonViewFestivals')}
            </ButtonIcon>
          </ContainerStyle>
        </ColorSection>
      </View>
    </Fragment>
  );
};

const HomepageStatistics = () => {
  const [statistics, setStatistics] = useState({
    festivals: null,
    artworks: null,
    artists: null,
  });

  const countResources = async (resourceName) => {
    const {
      pagination: { total },
    } = await apiRequest({
      path: [resourceName],
    });

    return total;
  };

  useEffect(() => {
    const updateStatistics = async () => {
      const [festivals, artworks, artists] = await Promise.all([
        countResources('festivals'),
        countResources('artworks'),
        countResources('artists'),
      ]);

      setStatistics({
        festivals,
        artworks,
        artists,
      });
    };

    updateStatistics();
  }, []);

  return (
    <Fragment>
      <HorizontalLine />

      <HomepageStatisticsItem
        label={translate('Homepage.bodyStatisticsFestivals')}
        number={statistics.festivals}
      />

      <HorizontalLine />

      <HomepageStatisticsItem
        label={translate('Homepage.bodyStatisticsArtists')}
        number={statistics.artists}
      />

      <HorizontalLine />

      <HomepageStatisticsItem
        label={translate('Homepage.bodyStatisticsArtworks')}
        number={statistics.artworks}
      />

      <HorizontalLine />
    </Fragment>
  );
};

const HomepageStatisticsItem = (props) => {
  return (
    <HomepageStatisticsItemStyle>
      <HomepageStatisticsItemNumberStyle>
        {props.number !== null ? props.number : '...'}
      </HomepageStatisticsItemNumberStyle>

      <HomepageStatisticsItemLabelStyle>
        {props.label}
      </HomepageStatisticsItemLabelStyle>
    </HomepageStatisticsItemStyle>
  );
};

const HomepageStatisticsItemNumberStyle = styled(ParagraphStyle)`
  font-size: 6em !important;
  font-family: ${styles.typography.familyHeading}, sans-serif;
`;

const HomepageStatisticsItemLabelStyle = styled(ParagraphStyle)`
  font-size: 3em !important;
  font-family: ${styles.typography.familyHeading}, sans-serif;
`;

const HomepageStatisticsItemStyle = styled.div`
  display: flex;

  align-items: center;

  ${/* sc-selector */ HomepageStatisticsItemNumberStyle},
  ${/* sc-selector */ HomepageStatisticsItemLabelStyle} {
    width: 50%;
  }
`;

HomepageStatisticsItem.propTypes = {
  label: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
};

export default Homepage;
