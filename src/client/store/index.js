import { combineReducers } from 'redux';

import api from '~/client/store/api/reducers';
import app from '~/client/store/app/reducers';

const rootReducer = combineReducers({
  api,
  app,
});

export default rootReducer;
