import { combineReducers } from 'redux';

import api from '~/client/store/api/reducers';
import app from '~/client/store/app/reducers';
import notifications from '~/client/store/notifications/reducers';
import tables from '~/client/store/tables/reducers';

const rootReducer = combineReducers({
  api,
  app,
  notifications,
  tables,
});

export default rootReducer;
