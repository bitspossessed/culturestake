import { combineReducers } from 'redux';
import { i18nState } from 'redux-i18n';

import appReducer from '~/store/app/reducers';

const rootReducer = combineReducers({
  i18nState,
  app: appReducer,
});

export default rootReducer;
