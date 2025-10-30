import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { worker } from './mocks/browser.js';

async function enableMocking() {
  // Enable MSW in both development and production for demo purposes
  await worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    },
    onUnhandledRequest: 'bypass'
  });
}enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});