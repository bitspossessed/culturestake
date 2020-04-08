import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import GlobalStyle from '~/client/styles';
import Notifications from '~/client/components/Notifications';
import Routes from '~/client/routes';
import { initializeApp } from '~/client/store/app/actions';

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
      <GlobalStyle />
      <Notifications />
      <Routes />
    </Router>
  );
};

export default App;
