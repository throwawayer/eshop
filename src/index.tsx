/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import RootStore from 'stores/RootStore';
import Routes from 'router';
import { initStorage } from 'services/storage';

import 'typeface-roboto';

const main = (): void => {
  initStorage();

  ReactDOM.render(
    <React.StrictMode>
      <Provider {...RootStore}>
        <Routes />
      </Provider>
    </React.StrictMode>,
    document.getElementById('app'),
  );
};

main();
