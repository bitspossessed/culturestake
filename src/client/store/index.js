import { combineReducers } from 'redux';

import api from '~/store/api/reducers';
import app from '~/store/app/reducers';

const rootReducer = combineReducers({
  api,
  app,
});

export default rootReducer;
