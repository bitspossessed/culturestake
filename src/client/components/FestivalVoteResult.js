import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Sticker from '~/client/components/Sticker';
import { SNUGGLEPUNKS_COUNT } from '~/client/components/SVGDefinitions';
import styles from '~/client/styles/variables';
import { useSticker, useStickerImage } from '~/client/hooks/sticker';

const SNUGGLEPUNK_SIZE = 10;

const FestivalVoteResult = ({
  rank,
  total,
  festivalSlug,
  artistName,
  artworkTitle,
  artworkDesc,
  artworkSlug,
  images,
  sticker,
  votePower,
}) => {
  // Calculate SnugglePunk Happyness Factor === snuggleness!
  const currentVotePower = Math.sqrt(total);
  const snuggleness =
    Math.round((currentVotePower / votePower) * (SNUGGLEPUNKS_COUNT - 1)) + 1;

  // Get the sticker and color scheme
  const stickerImagePath = useStickerImage(images);
  const { scheme } = useSticker(sticker);

  return (
    <FestivalVoteResultStyle scheme={scheme}>
      <FestivalVoteResultHeaderStyle>
        <FestivalVoteResultRankStyle>{rank}</FestivalVoteResultRankStyle>

        <SnuggleStyle>
          <use xlinkHref={`#snugglepunk-${snuggleness}`} />
        </SnuggleStyle>

        <FestivalVoteResultVotesLayout>
          <FestivalVoteResultVotesStyle>{total}</FestivalVoteResultVotesStyle>
          Votes
        </FestivalVoteResultVotesLayout>
      </FestivalVoteResultHeaderStyle>

      {stickerImagePath && (
        <Sticker code={sticker} imagePath={stickerImagePath} />
      )}

      <FestivalVoteResultFooterStyle>
        <FestivalVoteResultButtonStyle
          href={`/festivals/${festivalSlug}/artworks/${artworkSlug}`}
        >
          <FestivalVoteResultHeadingStyle scheme={scheme}>
            {artworkTitle}
          </FestivalVoteResultHeadingStyle>
        </FestivalVoteResultButtonStyle>

        <FestivalVoteResultSubHeadingStyle scheme={scheme}>
          {artistName} x {artworkDesc}
        </FestivalVoteResultSubHeadingStyle>
      </FestivalVoteResultFooterStyle>
    </FestivalVoteResultStyle>
  );
};

const FestivalVoteResultStyle = styled.div`
  position: relative;

  padding: 1em;
`;

const FestivalVoteResultHeaderStyle = styled.div`
  display: flex;

  justify-content: space-evenly;
`;

const FestivalVoteResultFooterStyle = styled.div`
  display: flex;

  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const FestivalVoteResultButtonStyle = styled.a`
  font-family: ${styles.typography.familyHeading}, sans-serif;
`;

const FestivalVoteResultVotesLayout = styled.div`
  display: flex;

  align-items: center;
  flex-direction: column;
`;

const FestivalVoteResultVotesStyle = styled.span`
  display: flex;

  font-size: 4em !important;
  font-family: ${styles.typography.familyHeading}, sans-serif;

  flex-direction: column;
  justify-content: space-between;
`;

const FestivalVoteResultRankStyle = styled.span`
  font-size: 6em !important;
  font-family: ${styles.typography.familyHeading}, sans-serif;
`;

const FestivalVoteResultHeadingStyle = styled.p`
  margin-bottom: 1rem;

  color: ${({ scheme }) => {
    if (scheme) {
      return styles.schemes[scheme].foreground;
    }

    return styles.colors.white;
  }};

  font-weight: ${styles.typography.weight};
  font-size: 3em;
  font-family: ${styles.typography.familyHeading}, sans-serif;

  line-height: 0.9;
`;

const FestivalVoteResultSubHeadingStyle = styled.p`
  color: ${({ scheme }) => {
    if (scheme) {
      return styles.schemes[scheme].foreground;
    }

    return styles.colors.white;
  }};

  font-weight: regular;
  font-size: 1.5em !important;
`;

const SnuggleStyle = styled.svg`
  position: relative;

  width: ${SNUGGLEPUNK_SIZE}rem;
  height: ${SNUGGLEPUNK_SIZE}rem;

  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));

  transition: filter ease-in 0.2s;
`;

FestivalVoteResult.propTypes = {
  artistName: PropTypes.string.isRequired,
  artworkDesc: PropTypes.string.isRequired,
  artworkSlug: PropTypes.string.isRequired,
  artworkTitle: PropTypes.string.isRequired,
  credit: PropTypes.number.isRequired,
  festivalSlug: PropTypes.string.isRequired,
  images: PropTypes.array,
  rank: PropTypes.number.isRequired,
  sticker: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  votePower: PropTypes.number.isRequired,
};

export default FestivalVoteResult;
