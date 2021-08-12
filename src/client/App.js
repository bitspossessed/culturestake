import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Normalize } from 'styled-normalize';
import { useDispatch, useSelector } from 'react-redux';

import '~/client/assets/favicon.png';
import '~/client/assets/favicon.svg';

import GlobalStyle from '~/client/styles';
import Notifications from '~/client/components/Notifications';
import Routes from '~/client/routes';
import SVGDefinitions from '~/client/components/SVGDefinitions';
import ThreeInterface from '~/client/components/ThreeInterface';
import { checkBoothStatus } from '~/client/store/booth/actions';
import { initializeApp } from '~/client/store/app/actions';
import {
  initializeProvider,
  checkPendingTransactions,
} from '~/client/store/ethereum/actions';

// import all images used in emails so webpack will build them
import emailImg3 from '~/client/assets/images/peoples-park-plinth.jpg'; // eslint-disable-line
import emailImg5 from '~/client/assets/images/vote-now.jpg'; // eslint-disable-line

const CHECK_FREQUENCY = 1000;

let checkInterval;

const App = () => {
  const dispatch = useDispatch();
  const { isAlternateColor } = useSelector((state) => state.app);

  useEffect(() => {
    const initialize = async () => {
      await dispatch(initializeApp());
      await dispatch(initializeProvider());
    };

    checkInterval = window.setInterval(() => {
      dispatch(checkPendingTransactions());
      dispatch(checkBoothStatus());
    }, CHECK_FREQUENCY);

    initialize();
  }, [dispatch]);

  window.addEventListener('unload', () => {
    window.clearInterval(checkInterval);
  });

  return (
    <Fragment>
      <Normalize />
      <GlobalStyle isAlternateColor={isAlternateColor} />
      <SVGDefinitions />

      <Router>
        <Notifications />
        <ThreeInterface />
        <Routes />
      </Router>
    </Fragment>
  );
};

export default App;
