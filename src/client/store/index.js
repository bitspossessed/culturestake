import { combineReducers } from 'redux';
import { i18nState } from 'redux-i18n';

import apiReducer from '~/store/api/reducers';
import appReducer from '~/store/app/reducers';

const rootReducer = combineReducers({
  i18nState,
  api: apiReducer,
  app: appReducer,
});

export default rootReducer;
