import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { CornieAppTheme } from '../theme/CornieAppTheme';
import { CornieAppRoutes } from '../routes/CornieAppRoutes';

import '../../scss/app.scss';

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
