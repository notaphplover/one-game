import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FormCustomHook } from './CustomHook/FormCustomHook';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FormCustomHook />
  </React.StrictMode>,
)
