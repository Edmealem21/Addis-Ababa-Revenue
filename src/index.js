import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ------------------------------------------------------------
// 1. MSW SETUP FUNCTION (Starts the mock server)
// ------------------------------------------------------------
async function enableMocking() {
  // Only run the mock server in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Dynamically import the worker (this keeps it out of production builds)
  const { worker } = await import('./mocks/browser');

  // Start the service worker and ignore unhandled requests (like CSS/images)
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

// ------------------------------------------------------------
// 2. RENDER REACT APP (Wait for MSW to start first)
// ------------------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root'));

// IMPORTANT: MSW must be ready BEFORE React renders
enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});