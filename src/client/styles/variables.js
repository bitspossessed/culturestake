// Definitions

const dimensions = {
  width: '800px',
  height: '720px',
};

const monochromes = {
  black: '#000',
  blue: '#023ba2',
  blueLight: '#3fc1ff',
  cyanLight: '#6afff4',
  gray: '#d5d5d5',
  grayLight: '#f7f7f7',
  lime: '#33ffa7',
  magenta: '#f0f',
  magentaPale: '#f3c2ff',
  pink: '#ff0062',
  red: '#f00',
  violet: '#ba00ff',
  white: '#fff',
  yellow: '#ff0',
};

const colors = {
  ...monochromes,
  transparent: 'transparent',
};

// Typography

const typography = {
  family: 'Montserrat Regular',
  familyAccessible: 'Myriad Pro Regular',
  familyHeading: 'Data70 Regular',
  lineHeight: 1.15,
  size: '1.4em',
  style: 'normal',
  weight: 400,
  weightBold: 900,
};

// Base

const layout = {
  borderRadius: '1rem',
  spacing: '2rem',
  width: dimensions.width,
  height: dimensions.height,
  maxWidth: '70rem',
};

const links = {
  color: colors.black,
  fontWeight: typography.weight,
};

// Components

const components = {};

// Media-query

const media = {
  desktop: `(min-width: ${dimensions.width})`,
};

// Z-index

const layers = {
  Paper: 3000,
  PaperTicket: 3200,
  PaperStamp: 3300,
  VoteCreditsBar: 5000,
  Navigation: 9000,
  ThreeInterfaceElement: 10000,
  SnuggleRain: 50000,
  Notifications: 60000,
};

// Accessibility

export const SCHEME_ALTERNATE = 'alternate';
export const SCHEME_BLACK = 'black';
export const SCHEME_BLUE = 'blue';
export const SCHEME_PINK = 'pink';
export const SCHEME_VIOLET = 'violet';

export const DEFAULT_SCHEME = SCHEME_VIOLET;

const schemes = {
  [SCHEME_ALTERNATE]: {
    background: colors.black,
    foreground: colors.yellow,
    backgroundSticker: colors.yellow,
  },
  [SCHEME_BLACK]: {
    background: colors.white,
    foreground: colors.black,
    backgroundSticker: colors.white,
  },
  [SCHEME_BLUE]: {
    background: colors.white,
    foreground: colors.blue,
    backgroundSticker: colors.lime,
  },
  [SCHEME_PINK]: {
    background: colors.white,
    foreground: colors.pink,
    backgroundSticker: colors.white,
  },
  [SCHEME_VIOLET]: {
    background: colors.white,
    foreground: colors.violet,
    backgroundSticker: colors.magentaPale,
  },
};

// Variables

export default {
  colors,
  components,
  layers,
  layout,
  links,
  media,
  schemes,
  typography,
};
