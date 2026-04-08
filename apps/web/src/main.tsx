import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.js';
import './styles/global.css';
import './styles/landing.css';
import './styles/profile.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Missing #root');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
