import 'pepjs';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from '~/client/App';
import store from '~/client/configureStore';

const Root = (props) => (
  <Provider store={props.store}>
    <App />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

ReactDOM.render(<Root store={store} />, document.getElementById('app'));
