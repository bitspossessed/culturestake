import { Segments } from 'celebrate';

const paramsValidation = {};

export default {
  read: {
    [Segments.PARAMS]: {
      ...paramsValidation,
    },
  },
};
