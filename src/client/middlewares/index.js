import logger from 'redux-logger';
import thunk from 'redux-thunk';

import apiErrorMiddleware from '~/client/middlewares/apiError';
import apiMiddleware from '~/client/middlewares/api';

const middlewares = [thunk, apiMiddleware, apiErrorMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export default middlewares;
