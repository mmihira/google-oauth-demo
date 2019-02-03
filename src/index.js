import React from 'react';
import { render } from 'react-dom';
import configureStore from './store.js';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from './history';
import Routes from './routes.js';

const rootEl = document.getElementById('root');
const App = () => <Routes />;
const store = configureStore();

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  rootEl
);
