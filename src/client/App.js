import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Normalize } from 'styled-normalize';
import { useDispatch, useSelector } from 'react-redux';

import ClipPathDefinitions from '~/client/components/ClipPathDefinitions';
import GlobalStyle from '~/client/styles';
import Notifications from '~/client/components/Notifications';
import Routes from '~/client/routes';
import ThreeInterface from '~/client/components/ThreeInterface';
import { initializeApp } from '~/client/store/app/actions';

const App = () => {
  const dispatch = useDispatch();
  const { isAlternateColor } = useSelector((state) => state.app);

  const onAppStart = () => {
    const initialize = async () => {
      await dispatch(initializeApp());
    };

    initialize();
  };

  useEffect(onAppStart, []);

  return (
    <Fragment>
      <Normalize />
      <GlobalStyle isAlternateColor={isAlternateColor} />
      <ClipPathDefinitions />

      <Router>
        <Notifications />
        <ThreeInterface />
        <Routes />
      </Router>
    </Fragment>
  );
};

export default App;
