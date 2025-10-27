import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { worker } from './mocks/browser.js';

async function enableMocking() {
  if (import.meta.env.DEV) {
    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js'
      },
      onUnhandledRequest: 'bypass'
    });
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});