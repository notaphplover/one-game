import '../../scss/app.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';

import { CornieAppRoutes } from '../routes/CornieAppRoutes';
import { store } from '../store/store';
import { CornieAppTheme } from '../theme/CornieAppTheme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
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
