// Definitions

const dimensions = {};

const monochromes = {
  black: '#000',
  grayLight: '#f7f7f7',
  gray: '#d5d5d5',
  white: '#fff',
  blue: '#083e9e',
  cyan: '#6dfcf1',
  cyanDark: '#54d2f6',
  green: '#40f2a2',
  greenLight: '#9cfcd2',
  pink: '#f3c4fd',
  pinkDark: '#b726f8',
  red: '#dc3e77',
};

const colors = {
  ...monochromes,
};

// Typography

const typography = {
  family: 'Montserrat Regular',
  familyAccessible: 'Myriad Pro Regular',
  familyHeading: 'Data70 Regular',
  lineHeight: 1.5,
  size: '1.6em',
  style: 'normal',
  weight: 400,
};

// Base

const layout = {
  borderRadius: '1rem',
  spacing: '2rem',
  width: dimensions.width,
  height: dimensions.height,
};

const links = {
  color: colors.black,
  fontWeight: typography.weight,
};

// Components

const components = {};

// Media-query

const media = {
  // desktop: `(min-width: ${dimensions.width})`,
};

// Z-index

const layers = {};

// Variables

export default {
  colors,
  components,
  layers,
  layout,
  links,
  media,
  typography,
};
