import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { CornieAppTheme } from '../theme';
import { CornieAppRoutes } from '../routes';
import '../../scss/app.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CornieAppTheme>
          <CornieAppRoutes />
        </CornieAppTheme>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
