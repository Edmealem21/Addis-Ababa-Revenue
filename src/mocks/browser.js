// src/mocks/browser.js
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This creates the Service Worker that intercepts fetch/axios requests
export const worker = setupWorker(...handlers);