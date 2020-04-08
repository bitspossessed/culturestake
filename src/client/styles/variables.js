// Definitions

const dimensions = {};

const monochromes = {
  black: '#000',
  white: '#fff',
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
