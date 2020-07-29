import { combineReducers } from 'redux';

import api from '~/client/store/api/reducers';
import app from '~/client/store/app/reducers';
import booth from '~/client/store/booth/reducers';
import ethereum from '~/client/store/ethereum/reducers';
import notifications from '~/client/store/notifications/reducers';
import tables from '~/client/store/tables/reducers';
import vote from '~/client/store/vote/reducers';

const rootReducer = combineReducers({
  api,
  app,
  booth,
  ethereum,
  notifications,
  tables,
  vote,
});

export default rootReducer;
