import { combineReducers } from 'redux';

import api from '~/client/store/api/reducers';
import app from '~/client/store/app/reducers';
import ethereum from '~/client/store/ethereum/reducers';
import notifications from '~/client/store/notifications/reducers';
import resources from '~/client/store/resources/reducers';
import tables from '~/client/store/tables/reducers';

const rootReducer = combineReducers({
  api,
  app,
  ethereum,
  notifications,
  resources,
  tables,
});

export default rootReducer;
