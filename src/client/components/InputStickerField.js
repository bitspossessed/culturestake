import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-form';

import ButtonOutline from '~/client/components/ButtonOutline';
import InputFieldsetRounded from '~/client/components/InputFieldsetRounded';
import Paper from '~/client/components/Paper';
import Sticker from '~/client/components/Sticker';
import translate from '~/common/services/i18n';
import { CLIP_PATH_DIMENSION } from '~/client/components/SVGDefinitions';
import {
  STICKER_CLIP_SHAPE_IDS,
  STICKER_PARTICLE_SHAPE_IDS,
  STICKER_SCHEMES,
  decodeSticker,
  encodeSticker,
} from '~/common/services/sticker';
import {
  InputSelectFieldInnerStyle,
  InputSelectFieldStyle,
} from '~/client/components/InputSelectField';
import { randomFromArray, randomRange } from '~/common/utils/random';
import { useField } from '~/client/hooks/forms';

const PARTICLES_OFFSET = 30;
const PARTICLES_MIN = 3;
const PARTICLES_MAX = 10;

const defaultSticker = {
  clipShapeId: Object.values(STICKER_CLIP_SHAPE_IDS)[0],
  particleShapeId: Object.values(STICKER_PARTICLE_SHAPE_IDS)[0],
  scheme: Object.values(STICKER_SCHEMES)[0],
  particlePositions: [],
};

const InputStickerField = ({ label, name, validate }) => {
  const formInstance = useFormContext();
  const [stickerParameters, setStickerParameters] = useState(defaultSticker);

  const { meta, setValue, value } = useField(name, {
    validate,
    defaultValue: encodeSticker(defaultSticker),
  });

  const setStickerParameter = useCallback(
    (name, stickerValue) => {
      const sticker = value ? decodeSticker(value) : defaultSticker;
      const code = encodeSticker(
        Object.assign({}, defaultSticker, sticker, {
          [name]: stickerValue,
        }),
      );

      setValue(code);
    },
    [setValue, value],
  );

  useEffect(() => {
    if (value) {
      setStickerParameters(decodeSticker(value));
    }
  }, [setStickerParameter, value]);

  const onChange = (event) => {
    event.preventDefault();

    setStickerParameter(event.target.name, event.target.value);
  };

  const onClickGenerate = (event) => {
    event.preventDefault();

    const particlePositions = new Array(
      randomRange(PARTICLES_MIN, PARTICLES_MAX),
    )
      .fill({})
      .map(() => {
        const offset = PARTICLES_OFFSET;
        const side = randomFromArray(['top', 'right', 'bottom', 'left']);

        let x = randomRange(offset, offset * 2);
        let y = randomRange(offset, offset * 2);

        if (side === 'top') {
          x = randomRange(offset, CLIP_PATH_DIMENSION - offset);
        } else if (side === 'right') {
          x = randomRange(
            CLIP_PATH_DIMENSION - offset * 2,
            CLIP_PATH_DIMENSION - offset,
          );
          y = randomRange(offset, CLIP_PATH_DIMENSION - offset);
        } else if (side === 'bottom') {
          x = randomRange(offset, CLIP_PATH_DIMENSION - offset);
          y = randomRange(
            CLIP_PATH_DIMENSION - offset * 2,
            CLIP_PATH_DIMENSION - offset,
          );
        } else if (side === 'left') {
          y = randomRange(offset, CLIP_PATH_DIMENSION - offset);
        }

        return {
          x,
          y,
        };
      });

    setStickerParameter('particlePositions', particlePositions);
  };

  const stickerImagePath = useMemo(() => {
    if (
      'images' in formInstance.values &&
      formInstance.values.images.length > 0
    ) {
      return formInstance.values.images[0].urlThresholdThumb;
    }

    return null;
  }, [formInstance.values]);

  return (
    <InputFieldsetRounded label={label} meta={meta} name={name}>
      <InputStickerFieldStyle>
        <Paper>
          <Sticker code={value} imagePath={stickerImagePath} />
        </Paper>

        <InputStickerFieldControlStyle>
          <InputSelectFieldStyle>
            <InputSelectFieldInnerStyle
              name="scheme"
              value={stickerParameters.scheme}
              onChange={onChange}
            >
              {Object.values(STICKER_SCHEMES).map((value) => {
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </InputSelectFieldInnerStyle>
          </InputSelectFieldStyle>

          <InputSelectFieldStyle>
            <InputSelectFieldInnerStyle
              name="clipShapeId"
              value={stickerParameters.clipShapeId}
              onChange={onChange}
            >
              {Object.values(STICKER_CLIP_SHAPE_IDS).map((value) => {
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </InputSelectFieldInnerStyle>
          </InputSelectFieldStyle>

          <InputSelectFieldStyle>
            <InputSelectFieldInnerStyle
              name="particleShapeId"
              value={stickerParameters.particleShapeId}
              onChange={onChange}
            >
              {Object.values(STICKER_PARTICLE_SHAPE_IDS).map((value) => {
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </InputSelectFieldInnerStyle>
          </InputSelectFieldStyle>

          <ButtonOutline onClick={onClickGenerate}>
            {translate('InputStickerField.buttonGenerateParticles')}
          </ButtonOutline>
        </InputStickerFieldControlStyle>
      </InputStickerFieldStyle>
    </InputFieldsetRounded>
  );
};

export const InputStickerFieldStyle = styled.div`
  padding: 1rem;
`;

export const InputStickerFieldControlStyle = styled.div`
  display: flex;

  margin-top: 2rem;

  flex-wrap: wrap;
  justify-content: center;

  & > * {
    margin: 0.5rem;
  }
`;

InputStickerField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputStickerField;
