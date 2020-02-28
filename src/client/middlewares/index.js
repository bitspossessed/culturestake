import logger from 'redux-logger';
import thunk from 'redux-thunk';

import api from '~/client/middlewares/api';
import apiError from '~/client/middlewares/apiError';
import notifications from '~/client/middlewares/notifications';

const middlewares = [thunk, api, apiError, notifications];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export default middlewares;
