import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CornieMain } from './CornieMain';
import { store } from './store';
import './scss/styles.css';


//import './scss/layout/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <CornieMain />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)
