import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { unregister } from './registerServiceWorker';

import { HashRouter } from 'react-router-dom';

import configureStore from './config/configureStore';

import { Provider } from 'react-redux';

import App from './components/App';

const store = configureStore();

const appElement = document.getElementById('app');

const root = ReactDOM.createRoot(appElement);

const renderApp = Component => {
  root.render(
    <Provider store={store}>
      <HashRouter>
        <Component />
      </HashRouter>
    </Provider>
  );  
};

renderApp(App);

/* if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    renderApp(NextApp);
  });
}
unregister(); */
