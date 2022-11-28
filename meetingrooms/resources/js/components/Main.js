import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}


/* import { unregister } from './registerServiceWorker';
import ErrorBoundary from './ErrorBoundary'
import * as serviceWorker from './serviceWorker';

import configureStore from '../config/configureStore';

import { Provider } from 'react-redux';

const store = configureStore(); */

/* ReactDOM.render(
<ErrorBoundary>
    <Provider store={store}>
        <App />
    </Provider>
</ErrorBoundary>,
document.getElementById('app')
);*/

/* const renderApp = Component => {
    ReactDOM.render(
        <Router>
          <Component />
        </Router>,
      document.getElementById('app')
    );
  };
  
  renderApp(App);


  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      renderApp(NextApp);
    });
  } */
  
  //unregister();