import { createStore, applyMiddleware } from 'redux';

import middlewares from '~/client/middlewares';
import reducers from '~/client/store';

export default createStore(reducers, applyMiddleware(...middlewares));
