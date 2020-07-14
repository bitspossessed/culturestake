import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

import PaperTicket from '~/client/components/PaperTicket';
import Sticker from '~/client/components/Sticker';
import {
  ParagraphStyle,
  HeadingPrimaryStyle,
} from '~/client/styles/typography';
import styles from '~/client/styles/variables';

const Festival = ({ title, subtitle, sticker }) => {
  return (
    <Suspense fallback={null}>
      <PaperTicket>
        <Sticker
          clipPathId={sticker.clipPathId}
          particlePositions={sticker.particlePositions}
          particleShape={sticker.particleShape}
          scheme={sticker.scheme}
          src={sticker.image.src}
        />

        <div style={{ position: 'relative', top: '-20px' }}>
          <HeadingPrimaryStyle
            style={{ textAlign: 'center', color: styles.colors.pink }}
          >
            {title}
          </HeadingPrimaryStyle>

          <ParagraphStyle
            style={{
              textTransform: 'uppercase',
              textAlign: 'center',
              color: styles.colors.pink,
            }}
          >
            {subtitle}
          </ParagraphStyle>
        </div>
      </PaperTicket>
    </Suspense>
  );
};

Sticker.propTypes = {
  sticker: PropTypes.object.isRequired,
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Festival;
