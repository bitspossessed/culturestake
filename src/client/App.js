import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Routes from '~/routes';
import { initializeApp } from '~/store/app/actions';

const App = () => {
  const dispatch = useDispatch();

  const onAppStart = () => {
    const initialize = async () => {
      await dispatch(initializeApp());
    };

    initialize();
  };

  useEffect(onAppStart, []);

  return (
    <Router>
      <Routes />
    </Router>
  );
};

App.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default App;