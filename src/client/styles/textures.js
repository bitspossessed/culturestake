import { CanvasTexture, MirroredRepeatWrapping } from 'three';

import styles from '~/client/styles/variables';

export function generateGradientTexture({
  size = 32,
  colorStops = [],
  repeat = 0.01,
}) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  context.rect(0, 0, size, size);

  const gradient = context.createLinearGradient(size, 0, size, size);
  colorStops.forEach((stop) => {
    gradient.addColorStop(stop.position, stop.color);
  });

  context.fillStyle = gradient;
  context.fill();

  const texture = new CanvasTexture(canvas);
  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = MirroredRepeatWrapping;
  texture.repeat.set(repeat, repeat);

  return texture;
}

export const limeGradientTexture = generateGradientTexture({
  colorStops: [
    {
      position: 0,
      color: styles.colors.yellow,
    },
    {
      position: 0.5,
      color: styles.colors.lime,
    },
    {
      position: 1,
      color: styles.colors.cyanLight,
    },
  ],
});

export const redGradientTexture = generateGradientTexture({
  colorStops: [
    {
      position: 0,
      color: styles.colors.gray,
    },
    {
      position: 1,
      color: styles.colors.red,
    },
  ],
});

export const blueGradientTexture = generateGradientTexture({
  colorStops: [
    {
      position: 0,
      color: styles.colors.blueLight,
    },
    {
      position: 1,
      color: styles.colors.cyanLight,
    },
  ],
});

export const alternateGradientTexture = generateGradientTexture({
  colorStops: [
    {
      position: 0,
      color: styles.colors.yellow,
    },
    {
      position: 1,
      color: styles.colors.yellow,
    },
  ],
});
