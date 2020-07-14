import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-form';

import InputFieldsetRounded from '~/client/components/InputFieldsetRounded';
import Sticker from '~/client/components/Sticker';
import { CLIP_PATH_DIMENSION } from '~/client/components/SVGDefinitions';
import {
  STICKER_CLIP_SHAPE_IDS,
  STICKER_PARTICLE_SHAPE_IDS,
  STICKER_SCHEMES,
  decodeSticker,
  encodeSticker,
} from '~/common/services/sticker';
import { InputFieldStyle } from '~/client/components/InputField';
import { randomFromArray, randomRange } from '~/common/utils/random';
import { useField } from '~/client/hooks/forms';

const PARTICLES_OFFSET = 30;
const PARTICLES_MIN = 2;
const PARTICLES_MAX = 7;

const defaultSticker = {
  clipShapeId: Object.values(STICKER_CLIP_SHAPE_IDS)[0],
  particleShapeId: Object.values(STICKER_PARTICLE_SHAPE_IDS)[0],
  scheme: Object.values(STICKER_SCHEMES)[0],
  particlePositions: [],
};

const InputStickerField = ({ label, name, validate }) => {
  const formInstance = useFormContext();

  const { meta, setValue, value } = useField(name, {
    validate,
    defaultValue: encodeSticker(defaultSticker),
  });

  const setStickerParameter = (name, stickerValue) => {
    const sticker = value ? decodeSticker(value) : defaultSticker;

    const code = encodeSticker(
      Object.assign({}, defaultSticker, sticker, {
        [name]: stickerValue,
      }),
    );

    setValue(code);
  };

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
      <Sticker code={value} imagePath={stickerImagePath} />

      <InputFieldStyle readOnly value={`Code: ${value}`} />

      <select
        name="scheme"
        value={value ? value.scheme : null}
        onChange={onChange}
      >
        {Object.values(STICKER_SCHEMES).map((value) => {
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </select>

      <select
        name="clipShapeId"
        value={value ? value.clipPathId : null}
        onChange={onChange}
      >
        {Object.values(STICKER_CLIP_SHAPE_IDS).map((value) => {
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </select>

      <select
        name="particleShapeId"
        value={value ? value.particleShapeId : null}
        onChange={onChange}
      >
        {Object.values(STICKER_PARTICLE_SHAPE_IDS).map((value) => {
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </select>

      <button onClick={onClickGenerate}>Generate</button>
    </InputFieldsetRounded>
  );
};

InputStickerField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default InputStickerField;
