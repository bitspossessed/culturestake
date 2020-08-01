import { MeshLambertMaterial } from 'three';

import {
  alternateGradientTexture,
  blueGradientTexture,
  limeGradientTexture,
  redGradientTexture,
} from '~/client/styles/textures';

function generateMaterial(texture) {
  return new MeshLambertMaterial({ map: texture });
}

export const alternateMaterial = generateMaterial(alternateGradientTexture);

export const blueMaterial = generateMaterial(blueGradientTexture);

export const limeMaterial = generateMaterial(limeGradientTexture);

export const redMaterial = generateMaterial(redGradientTexture);
